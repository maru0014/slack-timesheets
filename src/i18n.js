import Polyglot from 'node-polyglot';

import resourceEn from './locales/en';
import resourceJa from './locales/ja';
import Configure from './gs-configure';
import Kernel from './kernel';


export default class I18n {
  constructor() {
    const kernel = new Kernel();
    const language = kernel.getLocale();
    console.warn(language);
    this.polyglot = {
      en: new Polyglot({phrases: resourceEn, locale: 'en'}),
      // ru: new Polyglot({ phrases: resourceRu, locale: 'ru' }),
      ja: new Polyglot({phrases: resourceJa, locale: 'ja'}),
    }[language];
  }

  __(key, options = null) {
    return this.polyglot.t(key, options);
  }
}