var TwoClient = require('@infosimples/node_two_captcha');
var client = null;


module.exports.setApiKey = function(key) {
    client = new TwoClient(key, {
        timeout: 60000,
        polling: 5000,
        throwErrors: false
    });
};

module.exports.balanceZero = (callback) => {
    client.balance().then((balance) => {
        if (balance > 0) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    }).catch(err => callback(err, null));
}

module.exports.decode = (captchaBASE64, callback) => {
    client.decode({base64: captchaBASE64}).then(result => {
        callback(null, result);
    }).catch(err => {
        callback(err, null);
    });
}