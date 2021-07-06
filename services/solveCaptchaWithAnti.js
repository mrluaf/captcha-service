const path = require('path');
const stream = require('stream');
const Anticaptcha = require(path.normalize(__dirname + '/./anticaptcha'));

var client = null;
var Stream = new stream.Stream();

module.exports.Stream = Stream;

module.exports.setApiKey = function(key) {
  client = Anticaptcha(key);
  client.setMinLength(3);
  client.Stream.on('log', data => Stream.emit('log', data));
};

module.exports.balanceZero = (callback) => {
    client.getBalance(function (err, balance) {
      if (err) {
        callback(err, null)
      } else {
        if (balance > 0) {
          callback(null, false);
        } else {
          callback(null, true);
        }
      }
    });
}

module.exports.decode = (captchaBASE64, callback) => {
  client.createImageToTextTask({
      case: true, // or params can be set for every captcha specially
      body: captchaBASE64
    }, (err, taskId) => {
      if (err) {
        callback(err, null);
      }

      // console.log('taskId:', taskId);

      client.getTaskSolution(taskId, function (err, taskSolution) {
        if (err) {
          callback(err, null);
        }

        // console.log('taskSolution:', taskSolution);
        callback(null, {text: taskSolution});
      });
    });
}