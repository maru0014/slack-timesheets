import Polyglot from 'node-polyglot';

import * as locales from './locales';

export default class I18n {
  constructor(locale = "en") {

    // this.polyglot = {
    //   en: new Polyglot({phrases: resourceEn, locale: 'en'}),
    //   ja: new Polyglot({phrases: resourceJa, locale: 'ja'}),
    // }[locale];


    this.polyglot = new Polyglot({phrases: locales[locale], locale: locale});

  }


  __(key, options = null) {
    return this.polyglot.t(key, options);
  }

}