import resourceEn from './locales/en';
import resourceJa from './locales/ja';
import i18next from 'i18next';


export default class I18n {
  constructor(namespace) {
    i18next
      .init({
        lng: "en",
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