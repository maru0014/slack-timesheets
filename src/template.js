import _ from 'lodash';

export default class Template {

  constructor(templateStrage) {
    this.strage = templateStrage;
  }

  // テンプレートからメッセージを生成
  render(label) {

    var message = this.strage.get(label);

    if (message) {
      for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];
        if(_.isArray(arg)) {
          arg = _.map(arg, function(u) {
            return "<@"+u+">";
          }).join(', ');
        }

        message = message.replace("#"+i, arg);
      }
      return message;
    }

    return arguments.join(', ');
  }

}
