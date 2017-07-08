import _ from 'lodash';
import * as locales from './locales';

// this class is used in unit tests

export default class TemplateStrage {

  get(label) {
    return "";
  }

  getLocales() {
    return _.keys(locales);
  }
}
