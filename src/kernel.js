import Slack from './slack';
import GASProperties from './gas-properties';
import GSConfigure from './gs-configure';
import GSTemplate from './template';
import GSTimesheets from './gs-timesheets';
import Template from './template';
import TemplateStrageGs from './template-strage-gs';
import I18n from './i18n';

export default class Kernel {
  constructor() {
  }

  boot(properties = new GASProperties()) {
    const spreadsheetId = properties.get('spreadsheet');
    if (spreadsheetId) {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      if (spreadsheet) {
        this.configure = new GSConfigure(spreadsheet);
        this.slack = new Slack(
          this.configure.get('Slack Incoming URL'),
          this.configure.get('IgnoredUsers')
        );
        this.locale = this.configure.get("Language");

        this.i18n = new I18n(this.locale);

        this.template = new Template(new TemplateStrageGs(spreadsheet, this.locale));
        this.timesheets = new GSTimesheets(this.i18n, spreadsheet, this.configure);
        return true;

      }
    }
    return false;
  }

  /**
   * @returns {GSConfigure}
   */
  getConfigure() {
    return this.configure;
  }

  /**
   *
   * @returns {Slack}
   */
  getSlack() {
    return this.slack;
  }

  /**
   *
   * @returns {GSTemplate}
   */
  getTemplate() {
    return this.template;
  }

  /**
   *
   * @returns {GSTimesheets}
   */
  getTimesheets() {
    return this.timesheets;
  }

  /**
   *
   * @returns {I18n}
   */
  getLocale() {
    return this.locale;
  }

  getI18n() {
    return this.i18n;
  }
}
