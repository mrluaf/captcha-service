# Captcha Service

## Supported captcha services
- [2Captcha](https://2captcha.com?from=9511131)
- [AntiCaptcha](http://getcaptchasolution.com/7hyxwizehv)
- [deathbycaptcha](https://www.deathbycaptcha.com)
- [AZcaptcha](https://azcaptcha.com)

## Installation

Via npm:

	npm install captcha-service

## Usage

```js
const CaptchaService = require('../index');

const solver = new CaptchaService({
  captcha_service: "twocaptcha",
  captcha_key: "captcha_key",
  imageCaptchaPath: "./img.png",
  renameImage: false
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
```

## API
### CaptchaService([options])
- `options` <[Object]>
  - `captcha_service` <[string]> Has support: azcaptcha, twocaptcha, anticaptcha, deathbycaptcha **(require)**
  - `captcha_key` <[string]|[Array]<[string]>> API KEY of captcha service. Example: `["KEY1", "KEY2"]` or just a single key `"KEY1"` or `["KEY1"]`
  - `imageCaptchaPath` <[string]|path> Captcha image file address
  - renameImage <[boolean]> `Default: false` Whether to rename captcha image file affter solved with the filename as the result of the captcha.
- return <Object>

### .solveCaptcha()
To solve captcha
- return: <[string]> Text from image captcha

## Author

👤 **[Văn Tài](https://nguyenvantai.vn)**

- Twitter: [@mrluaf](https://twitter.com/mrluaf)
- Facebook: [@LuaAcoustic](https://www.facebook.com/LuaAcoustic)
- Github: [@mrluaf](https://github.com/mrluaf)
- Gitlab: [@mrluaf](https://gitlab.com/mrluaf)

## 📝 License

Copyright © 2021 [Văn Tài](https://nguyenvantai.vn).<br />

---

_Made with ❤️ by [Văn Tài](https://nguyenvantai.vn)_

[axnode]: #accessibilitysnapshotoptions 'AXNode'
[accessibility]: #class-accessibility 'Accessibility'
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array 'Array'
[body]: #class-body 'Body'
[browsercontext]: #class-browsercontext 'BrowserContext'
[browserfetcher]: #class-browserfetcher 'BrowserFetcher'
[browser]: #class-browser 'Browser'
[buffer]: https://nodejs.org/api/buffer.html#buffer_class_buffer 'Buffer'
[cdpsession]: #class-cdpsession 'CDPSession'
[childprocess]: https://nodejs.org/api/child_process.html 'ChildProcess'
[connectiontransport]: ../src/WebSocketTransport.js 'ConnectionTransport'
[consolemessage]: #class-consolemessage 'ConsoleMessage'
[coverage]: #class-coverage 'Coverage'
[dialog]: #class-dialog 'Dialog'
[elementhandle]: #class-elementhandle 'ElementHandle'
[element]: https://developer.mozilla.org/en-US/docs/Web/API/element 'Element'
[error]: https://nodejs.org/api/errors.html#errors_class_error 'Error'
[executioncontext]: #class-executioncontext 'ExecutionContext'
[filechooser]: #class-filechooser 'FileChooser'
[frame]: #class-frame 'Frame'
[jshandle]: #class-jshandle 'JSHandle'
[keyboard]: #class-keyboard 'Keyboard'
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map 'Map'
[mouse]: #class-mouse 'Mouse'
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object 'Object'
[page]: #class-page 'Page'
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 'Promise'
[httprequest]: #class-httprequest 'HTTPRequest'
[httpresponse]: #class-httpresponse 'HTTPResponse'
[securitydetails]: #class-securitydetails 'SecurityDetails'
[serializable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description 'Serializable'
[target]: #class-target 'Target'
[timeouterror]: #class-timeouterror 'TimeoutError'
[touchscreen]: #class-touchscreen 'Touchscreen'
[tracing]: #class-tracing 'Tracing'
[uievent.detail]: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail 'UIEvent.detail'
[uskeyboardlayout]: ../src/common/USKeyboardLayout.ts 'USKeyboardLayout'
[unixtime]: https://en.wikipedia.org/wiki/Unix_time 'Unix Time'
[webworker]: #class-webworker 'Worker'
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type 'Boolean'
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function 'Function'
[iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols 'Iterator'
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type 'Number'
[origin]: https://developer.mozilla.org/en-US/docs/Glossary/Origin 'Origin'
[selector]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors 'selector'
[stream.readable]: https://nodejs.org/api/stream.html#stream_class_stream_readable 'stream.Readable'
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type 'String'
[symbol]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type 'Symbol'
[xpath]: https://developer.mozilla.org/en-US/docs/Web/XPath 'xpath'
[customqueryhandler]: #interface-customqueryhandler 'CustomQueryHandler'