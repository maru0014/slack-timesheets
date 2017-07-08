import _ from 'lodash';

export default class Template {

  constructor(templateStrage) {
    this.strage = templateStrage;
  }

  // generate messages from the template
  render(label) {
    let message = this.strage.get(label);

    if (message) {
      for (let i = 1; i < arguments.length; i++) {
        let arg = arguments[i];
        if (_.isArray(arg)) {
          arg = _.map(arg, function (u) {
            return "<@" + u + ">";
          }).join(', ');
        }
        message = message.replace("#" + i, arg);
      }
      return message;
    }
    return arguments.join(', ');
  }
  localeExists(locale) {
    const locales = this.strage.getLocales();
    return locales.indexOf(locale) > -1;
  }
}
