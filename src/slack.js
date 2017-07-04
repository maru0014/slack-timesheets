import _ from 'lodash';

export default class Slack {
  constructor(incomingURL, ignoreUsers) {
    this.incomingURL = incomingURL;
    this.ignoreUsers = (ignoreUsers || '').toLowerCase().replace(/^\s*(.*?)\s*$/, "$1").split(/\s*,\s*/);
  }

  // send the received message to timesheets
  receiveMessage(message, callback) {
    const username = String(message.user_name);
    const body = String(message['text']);

    // ignore ignoreUsers
    if (_.includes(this.ignoreUsers, username.toLowerCase())) return;

    if (callback) {
      callback(username, body);
    }
  };

  // send message
  send(message, options) {
    options = _.clone(options || {});
    options["text"] = message;

    const send_options = {
      method: "post",
      payload: {"payload": JSON.stringify(options)}
    };

    if (this.incomingURL) {
      UrlFetchApp.fetch(this.incomingURL, send_options);
    }

    return message;
  };

}
