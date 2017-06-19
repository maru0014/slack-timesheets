import resourceFile from './locales/en';
import Polyglot from 'node-polyglot';

const polyglot = new Polyglot({phrases: resourceFile});

export default class I18n {
  constructor(locale) {
    locale = locale? locale: "en";

    polyglot.locale(locale);

  }

  __(key) {
    return polyglot.t(key);
  }
}