import resourceEn from './locales/en';
import resourceJa from './locales/ja';


export default class I18n {
  constructor(locale, namespace) {
    this.locale = locale;

    var i18next = require('i18next').default;
    i18next
      .init({
        lng: locale,
        resources: {
          en: resourceEn,
          ja: resourceJa
        },
        defaultNS: namespace,
      })
    ;

  }

  __(key) {
    return i18next.t(key);
  }
}