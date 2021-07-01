const fs = require('fs');
const path = require('path');
const imageToBase64 = require('image-to-base64');
const stream = require('stream');
const isBase64 = require('is-base64');
const BPromise = require('bluebird');

class CapchaService {
  constructor(extra_options = {}) {
    this.Stream = new stream.Stream();
    let {
      captcha_service,
      captcha_key,
      imageCaptchaPath,
      renameImage
    } = extra_options;

    if (!imageCaptchaPath) throw new Error('Please input imageCaptchaPath');
    if (!captcha_key) throw new Error('captcha_key missing');

    this.renameImage = (typeof(renameImage) === "boolean")?renameImage:false;
    this.imageCaptchaPath = path.resolve(imageCaptchaPath);
    this.captchaFileName = path.basename(this.imageCaptchaPath);
    this.captcha_service = captcha_service || 'twocaptcha';
    this.captcha_key = (typeof (captcha_key) == "object") ? captcha_key || [''] : [captcha_key || ''];
    
    switch (captcha_service) {
      case 'azcaptcha':
        this.solver = require(path.normalize(__dirname + '/./services/solveCaptchaWithAzCaptcha'));
        this.solver.setApiKey(this.captcha_key[0]);
        break;
      case 'twocaptcha':
        this.solver = require(path.normalize(__dirname + '/./services/twocaptcha'));
        this.solver.setApiKey(this.captcha_key[0]);
        break;
      case 'anticaptcha':
        this.solver = require(path.normalize(__dirname + '/./services/solveCaptchaWithAnti'));
        this.solver.setApiKey(this.captcha_key[0]);
        break;
      case 'deathbycaptcha':
        this.solver = require(path.normalize(__dirname + '/./services/deathbycaptcha2'));
        this.solver.setApiKey(this.captcha_key[0]);
        break;
      default:
        this.solver = require(path.normalize(__dirname + '/./services/solveCaptchaWithAzCaptcha'));
        this.solver.setApiKey(this.captcha_key[0]);
        break;
    }

  }
  changeCaptchaImageFileName(solvedCaptchaString) {
    return new Promise((resolve, reject) => {
      try {
        const imageExtname = path.extname(this.captchaFileName);
        this.Stream.emit('log', `Changing captcha file name: ${this.captchaFileName}`);

        const captcha_folder = path.dirname(this.imageCaptchaPath);
        let RecaptchaFileName = path.format({
          name: solvedCaptchaString || (this.solvedCaptchaString || '').trim() || 'captcha',
          ext: imageExtname
        });
        let imageCaptchaPathRename = path.format({
          dir: captcha_folder,
          base: RecaptchaFileName
        }) || './captcha.jpg';

        fs.renameSync(this.imageCaptchaPath, imageCaptchaPathRename);

        this.Stream.emit('log', `Captcha file name has been changed: from ${this.captchaFileName} --> ${RecaptchaFileName}`);
      } catch (e) {
        this.Stream.emit('log', `Change Captcha File Name ERROR: ${e.message}`);
      } finally {
        this.Stream.emit('log', `Captcha resolved`);
        resolve();
      }

    });
  }
  solveCaptchaWithCaptchaService(captcha_index = 0) {
    return new Promise(async (resolve, reject) => {
      try {
        this.Stream.emit('log', `Solve captcha with captcha_index: ${captcha_index}`);
        this.solver.balanceZero(async (err, isZero) => {
          if (err) return reject(err);
          try {
            if (isZero == true) {
              if (captcha_index == (this.captcha_key.length - 1)) {
                reject(new Error(`ERROR_USER_BALANCE_ZERO`));
              } else {
                this.solver.setApiKey(this.captcha_key[captcha_index + 1]);
                this.solveCaptchaWithCaptchaService(captcha_index + 1).then(data => resolve(data)).catch(err => reject(err));
              }
            } else {
              switch (this.captcha_service) {
                case 'deathbycaptcha':
                  this.solver.decodeFile(this.imageCaptchaPath, 10000, (err, result) => {
                    if (err) {
                      reject(new Error(`Deathbycaptcha Error: ${(err || '').toString()}`));
                    } else {
                      this.Stream.emit('log', `Deathbycaptcha: ${JSON.stringify(result)}`);
                      resolve(result.text || '');
                    }
                  });
                  break;
                  
                case 'twocaptcha':
                  try {
                    const captchaBASE64 = await imageToBase64(this.imageCaptchaPath);
                    await this.solver.decode(captchaBASE64, (err, result) => {
                      this.Stream.emit('log', `TwoCaptcha: ${JSON.stringify(result)}`);
                      resolve(result.text || '');
                    });

                  } catch (err) {
                    reject(err);
                  } finally {
                    break;
                  }

                  case 'anticaptcha':
                    try {
                      const captchaBASE64 = await imageToBase64(this.imageCaptchaPath);
                      this.solver.decode(captchaBASE64, (err, result) => {
                        if (err) {
                          reject(new Error(`anticaptcha Error: ${(err || '').toString()}`));
                        } else {
                          this.Stream.emit('log', `anticaptcha: ${JSON.stringify(result)}`);
                          resolve(result.text || '');
                        }
                      });
                    } catch (err) {
                      reject(err);
                    } finally {
                      break;
                    }

                  default:
                    try {
                      const captchaBASE64 = await imageToBase64(this.imageCaptchaPath);
                      this.solver.decode(captchaBASE64, {
                        pollingInterval: 10000
                      }, (err, result, invalid) => {
                        if (err) {
                          reject(new Error(`AZCaptcha Error: ${(err || '').toString()}`));
                        } else {
                          this.Stream.emit('log', `AZCaptcha: ${JSON.stringify(result)}`);
                          resolve(result.text || '');
                        }
                      });
                    } catch (err) {
                      reject(err);
                    } finally {
                      break;
                    }
              }

            }
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  solveCaptcha(trytime = 1) {
    return new Promise(async (resolve, reject) => {
      try {
        this.Stream.emit('log', `Solving captcha trytime=${trytime}`);
        this.solvedCaptchaString = await this.solveCaptchaWithCaptchaService();
        this.Stream.emit('log', `Captcha result: ${this.solvedCaptchaString} | ${this.captchaFileName}`);
        if (this.renameImage) await this.changeCaptchaImageFileName();
        resolve(this.solvedCaptchaString);

      } catch (err) {
        
        this.Stream.emit('log', `Captcha error: ${err.message}`);
        if (err.message.includes('ERROR_USER_BALANCE_ZERO')) {
          reject(err);
        } else if (err.message.includes('ERROR_WRONG_USER_KEY')) {
          reject(err);
        } else {
          if (trytime == 0) {
            reject(new Error('Can not solve captcha'));
          } else {
            try {
              await BPromise.delay(1000);
              const retryData = await this.solveCaptcha(trytime - 1);
              resolve(retryData);
            } catch (e) {
              reject(e);
            }
          }
        }
      }

    });
  }
}

module.exports = CapchaService;