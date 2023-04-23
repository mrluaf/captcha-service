var TwoClient = require('@infosimples/node_two_captcha');
var client = null;


module.exports.setApiKey = function (key) {
  client = new TwoClient(key, {
    timeout: 60000,
    polling: 5000,
    throwErrors: false
  });
};

module.exports.balanceZero = (callback) => {
  client.balance().then((balance) => {
    if (typeof(balance) === "string") {
      if (balance.includes("ERROR_USER_BALANCE_ZERO")) {
        callback(null, true);
      } else {
        err = new Error(`${balance}`);
        callback(err, null);
      }
    } else {
      if (balance > 0) {
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  }).catch(err => callback(err, null));
}

module.exports.decode = (captchaBASE64, options = {}, callback) => {
  client.decode({
    base64: captchaBASE64,
    ...options
  }).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err, null);
  });
}