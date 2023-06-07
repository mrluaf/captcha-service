const fs = require('fs');
const path = require('path');
const imageToBase64 = require('image-to-base64');
const stream = require('stream');
const BPromise = require('bluebird');
const get = require('lodash/get');

class CapchaService {
  constructor(extra_options = {}) {
    this.Stream = new stream.Stream();
    let {
      captcha_service,
      captcha_key,
      imageCaptchaPath,
      renameImage,
      captchaType,
      websiteURL,
      websiteKey,
      captchaOptions,
    } = extra_options;
    this.captchaOptions = captchaOptions || {};
    this.captchaType = captchaType ? captchaType : 'image';
    switch (this.captchaType) {
      case 'image':
        if (!imageCaptchaPath) throw new Error('Please input imageCaptchaPath');
        if (!captcha_key) throw new Error('captcha_key missing');
        this.imageCaptchaPath = path.resolve(imageCaptchaPath);
        this.captchaFileName = path.basename(this.imageCaptchaPath);
        this.renameImage = (typeof(renameImage) === "boolean")?renameImage:false;
        break;
      case 'recaptchav2':
        if (!websiteURL) throw new Error('Please input websiteURL');
        if (!websiteKey) throw new Error('Please input websiteKey');
        this.websiteURL = websiteURL;
        this.websiteKey = websiteKey;
        break;
    
      default:
        throw new Error(`Captcha type: ${this.captchaType} is not supported`);
        break;
    }
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
        this.solver.Stream.on('log', data => this.Stream.emit('log', data));
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
  changeCaptchaImageFileName(solvedCaptchaString, imageCaptchaPath) {
    return new Promise((resolve, reject) => {
      try {
        solvedCaptchaString = solvedCaptchaString || this.solvedCaptchaString || '';
        imageCaptchaPath = path.resolve(imageCaptchaPath || this.imageCaptchaPath);
        const captchaFileName = path.basename(imageCaptchaPath);
        const imageExtname = path.extname(captchaFileName);
        this.Stream.emit('log', `Changing captcha file name: ${captchaFileName}`);

        const captcha_folder = path.dirname(imageCaptchaPath);
        let RecaptchaFileName = path.format({
          name: solvedCaptchaString.trim() || 'captcha',
          ext: imageExtname
        });
        let imageCaptchaPathRename = path.format({
          dir: captcha_folder,
          base: RecaptchaFileName
        }) || './captcha.jpg';

        fs.renameSync(imageCaptchaPath, imageCaptchaPathRename);

        this.Stream.emit('log', `Captcha file name has been changed: from ${captchaFileName} --> ${RecaptchaFileName}`);
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
                      const textResult = get(result, 'text', '');
                      resolve(textResult);
                    }
                  });
                  break;
                  
                case 'twocaptcha':
                  try {
                    const captchaBASE64 = await imageToBase64(this.imageCaptchaPath);
                    await this.solver.decode(captchaBASE64, this.captchaOptions, (err, result) => {
                      this.Stream.emit('log', `TwoCaptcha: ${JSON.stringify(result)}`);
                      const textResult = get(result, 'text', '');
                      resolve(textResult);
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
                          const textResult = get(result, 'text', '');
                          resolve(textResult);
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
                          const textResult = get(result, 'text', '');
                          resolve(textResult);
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
  solveRecapchaV2(captcha_index = 0) {
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
                this.solveRecapchaV2(captcha_index + 1).then(data => resolve(data)).catch(err => reject(err));
              }
            } else {
              switch (this.captcha_service) {
                case 'anticaptcha':
                  try {
                    this.solver.solveRecaptchaV2({
                      websiteKey: this.websiteKey,
                      websiteURL: this.websiteURL,
                    }, (err, result) => {
                      if (err) {
                        reject(new Error(`anticaptcha Error: ${(err || '').toString()}`));
                      } else {
                        this.Stream.emit('log', `anticaptcha: ${JSON.stringify(result)}`);
                        resolve(get(result, 'text', ''));
                      }
                    });
                  } catch (err) {
                    reject(err);
                  } finally {
                    break;
                  }

                default:
                  reject(new Error(`ERROR_CAPTCHA_SERVICE_NOT_SUPPORTED`));
                  break;
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
        this.Stream.emit('log', `Solving ${this.captchaType} captcha trytime=${trytime}`);
        let response = null;
        switch (this.captchaType) {
          case 'image':
            this.solvedCaptchaString = await this.solveCaptchaWithCaptchaService();
            this.Stream.emit('log', `Captcha result: ${this.solvedCaptchaString} | ${this.captchaFileName}`);
            if (this.renameImage) await this.changeCaptchaImageFileName();
            response = this.solvedCaptchaString;
            break;
          case 'recaptchav2': {
            const solvedCaptchaString = await this.solveRecapchaV2();
            this.Stream.emit('log', `Captcha result: ${solvedCaptchaString}`);
            response = solvedCaptchaString;
            break;
          }
          
          default:

            break;
        }

        resolve(response);
      } catch (err) {
        const errMsg = get(err, 'message', String(err));
        this.Stream.emit('log', `Captcha error: ${errMsg}`);
        if (errMsg.includes('ERROR_USER_BALANCE_ZERO')) {
          reject(err);
        } else if (errMsg.includes('ERROR_WRONG_USER_KEY')) {
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