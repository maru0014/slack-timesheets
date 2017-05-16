import _ from 'lodash';

export default class Slack {
  constructor(incomingURL, ignoreUsers) {
    this.incomingURL = incomingURL;
    this.ignoreUsers = (ignoreUsers || '').toLowerCase().replace(/^\s*(.*?)\s*$/, "$1").split(/\s*,\s*/);
  }

  // 受信したメッセージをtimesheetsに投げる
  receiveMessage (message, callback) {
    var username = String(message.user_name);
    var body = String(message['text']);

    // 特定のアカウントには反応しない
    if(_.includes(this.ignoreUsers, username.toLowerCase())) return;

    // -で始まるメッセージも無視
    if(body.match(/^-/)) return;

    if (callback) {
      callback(username, body);
    }
  };

  // メッセージ送信
  send (message, options) {
    options = _.clone(options || {});
    options["text"] = message;

    var send_options = {
      method: "post",
      payload: {"payload": JSON.stringify(options)}
    };

    if(this.incomingURL) {
      UrlFetchApp.fetch(this.incomingURL, send_options);
    }

    return message;
  };
  //
  // // テンプレート付きでメッセージ送信
  // template () {
  //   this.send(this._template.template.apply(this._template, arguments));
  // };

}
