import Polyglot from 'node-polyglot';

import * as locales from './locales';

export default class I18n {
  constructor(locale = "en") {
    this.polyglot = new Polyglot({phrases: locales[locale], locale: locale});
  }

  // replace method t() of Polyglot with __ *easier to detect
  __(key, options = null) {
    return this.polyglot.t(key, options);
  }

}