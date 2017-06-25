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
        if(spreadsheetId) {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            if (spreadsheet) {
                this.slack = new Slack(
                    this.configure.get('Slack Incoming URL'),
                    this.configure.get('無視するユーザ')
                );
                this.locale = this.configure.get("Language");


                this.template = new Template(new TemplateStrageGs(spreadsheet, this.i18n));
                this.timesheets = new GSTimesheets(spreadsheet, this.configure);
                return true;

            }
        }
        return false;
    }

    /**
     * @returns {GSConfigure}
     */
    getConfigure () {
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
}
