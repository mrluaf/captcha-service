require('dotenv').config();
const CaptchaService = require('../index');

const solver = new CaptchaService({
  captcha_service: process.env.SERVICE || "anticaptcha",
  captcha_key: process.env.KEY || "captcha_key",
  captchaType: "recaptchav2",
  websiteURL: "https://ipay.vietinbank.vn/login",
  websiteKey: "6LfLuZ8aAAAAAK8VxR1Nk1rwA-LEALM99o2r3Ujd",
});

solver.Stream.on('log', data => console.log('log:', data));

solver.solveCaptcha().then(result => {

  console.log("Result:", result);
  // log: Solving recaptchav2 captcha trytime=1
  // log: Solve captcha with captcha_index: 0
  // log: {"errorId":0,"balance":3.32293}
  // log: {"errorId":0,"taskId":957367596}
  // log: Waiting 5 seconds
  // log: {"errorId":0,"status":"ready","solution":{"gRecaptchaResponse":"03AGdBq26pUM1Kt_Q2v5XiS4q72xOetIEKKyym60gnFIOXAVQ-ctIAnmGV_qyzuloqfcNYo_AFNAOUHMONl9J5lg1hs5J2nvObu11ambSYWke1-kFdhCAUgT5ywaF3VmFwQwkssVAeOSYqkvroujgoJiPbYkb7fizOBIUL5pgTwKFYX2kq94r2kUKfcfC7u8V5rtXg-SzzYJqRAi1BXrFOv1V958f7qHSerI_gOLCSsoFqpYUvgaASSEMuf83H2l3zNp419BrTtw2jTTr2ku5RQtlW1mrKX43EK4qJDvJwHgMrSmsxGCaPwhNn_Epb6abjkxSZxgI8lE2cLgHjkX_IiyEJSHaCaaDuAEVjpb8XohF8DgUPckIL_CvwB6cwOk5CwdAzBpuaa5ZISWMHVvP1eEY30zPm5B3rbWbHVXFwZrkAcTRSvkezInVeQsIXOlRK6r48xutz785XVAXcVTAimi86ro11jeTA2mYpJAkuO4n_trjIhhPLZ23Drq7oODa98Gcu6RWg7HZ2GFSRJarhIu6yOnJz7BPsxB3GUvIq4TlrkXw-xM27xS4"},"cost":"0.00200","ip":"42.117.25.87","createTime":1637080776,"endTime":1637080777,"solveCount":0}
  // log: anticaptcha: {"text":"03AGdBq26pUM1Kt_Q2v5XiS4q72xOetIEKKyym60gnFIOXAVQ-ctIAnmGV_qyzuloqfcNYo_AFNAOUHMONl9J5lg1hs5J2nvObu11ambSYWke1-kFdhCAUgT5ywaF3VmFwQwkssVAeOSYqkvroujgoJiPbYkb7fizOBIUL5pgTwKFYX2kq94r2kUKfcfC7u8V5rtXg-SzzYJqRAi1BXrFOv1V958f7qHSerI_gOLCSsoFqpYUvgaASSEMuf83H2l3zNp419BrTtw2jTTr2ku5RQtlW1mrKX43EK4qJDvJwHgMrSmsxGCaPwhNn_Epb6abjkxSZxgI8lE2cLgHjkX_IiyEJSHaCaaDuAEVjpb8XohF8DgUPckIL_CvwB6cwOk5CwdAzBpuaa5ZISWMHVvP1eEY30zPm5B3rbWbHVXFwZrkAcTRSvkezInVeQsIXOlRK6r48xutz785XVAXcVTAimi86ro11jeTA2mYpJAkuO4n_trjIhhPLZ23Drq7oODa98Gcu6RWg7HZ2GFSRJarhIu6yOnJz7BPsxB3GUvIq4TlrkXw-xM27xS4"}
  // log: Captcha result: 03AGdBq26pUM1Kt_Q2v5XiS4q72xOetIEKKyym60gnFIOXAVQ-ctIAnmGV_qyzuloqfcNYo_AFNAOUHMONl9J5lg1hs5J2nvObu11ambSYWke1-kFdhCAUgT5ywaF3VmFwQwkssVAeOSYqkvroujgoJiPbYkb7fizOBIUL5pgTwKFYX2kq94r2kUKfcfC7u8V5rtXg-SzzYJqRAi1BXrFOv1V958f7qHSerI_gOLCSsoFqpYUvgaASSEMuf83H2l3zNp419BrTtw2jTTr2ku5RQtlW1mrKX43EK4qJDvJwHgMrSmsxGCaPwhNn_Epb6abjkxSZxgI8lE2cLgHjkX_IiyEJSHaCaaDuAEVjpb8XohF8DgUPckIL_CvwB6cwOk5CwdAzBpuaa5ZISWMHVvP1eEY30zPm5B3rbWbHVXFwZrkAcTRSvkezInVeQsIXOlRK6r48xutz785XVAXcVTAimi86ro11jeTA2mYpJAkuO4n_trjIhhPLZ23Drq7oODa98Gcu6RWg7HZ2GFSRJarhIu6yOnJz7BPsxB3GUvIq4TlrkXw-xM27xS4
  // Result: 03AGdBq26pUM1Kt_Q2v5XiS4q72xOetIEKKyym60gnFIOXAVQ-ctIAnmGV_qyzuloqfcNYo_AFNAOUHMONl9J5lg1hs5J2nvObu11ambSYWke1-kFdhCAUgT5ywaF3VmFwQwkssVAeOSYqkvroujgoJiPbYkb7fizOBIUL5pgTwKFYX2kq94r2kUKfcfC7u8V5rtXg-SzzYJqRAi1BXrFOv1V958f7qHSerI_gOLCSsoFqpYUvgaASSEMuf83H2l3zNp419BrTtw2jTTr2ku5RQtlW1mrKX43EK4qJDvJwHgMrSmsxGCaPwhNn_Epb6abjkxSZxgI8lE2cLgHjkX_IiyEJSHaCaaDuAEVjpb8XohF8DgUPckIL_CvwB6cwOk5CwdAzBpuaa5ZISWMHVvP1eEY30zPm5B3rbWbHVXFwZrkAcTRSvkezInVeQsIXOlRK6r48xutz785XVAXcVTAimi86ro11jeTA2mYpJAkuO4n_trjIhhPLZ23Drq7oODa98Gcu6RWg7HZ2GFSRJarhIu6yOnJz7BPsxB3GUvIq4TlrkXw-xM27xS4

}).catch(err => console.log(err));