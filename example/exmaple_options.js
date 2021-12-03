require('dotenv').config();
const CaptchaService = require('../index');

const solver = new CaptchaService({
  captcha_service: process.env.SERVICE || "twocaptcha",
  captcha_key: process.env.KEY || "captcha_key",
  captchaType: "image",
  imageCaptchaPath: "./img2.png",
  renameImage: false,
  captchaOptions: {
    regsense: 1
  }
});

solver.Stream.on('log', data => console.log('log:', data));

solver.solveCaptcha().then(text => {

  console.log("Result:", text);

  // log: Solving captcha trytime=1
  // log: Solve captcha with captcha_index: 0
  // log: TwoCaptcha: {"_id":"67389604474","_apiResponse":"OK|vbwzye","_text":"vbwzye"}
  // log: Captcha result: vbwzye | img.png
  // Result: vbwzye

}).catch(err => console.log(err));