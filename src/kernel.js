import Slack from './slack';
import GASProperties from './gas-properties';
import GSConfigure from './gs-configure';
import GSTemplate from './template';
import GSTimesheets from './gs-timesheets';
import Template from './template';
import TemplateStrageGs from './template-strage-gs';
import HelpCommand from './command/command-help';

export default class Kernel {
    constructor() {
    }

    boot(properties = new GASProperties()) {
        const spreadsheetId = properties.get('spreadsheet');
        if(spreadsheetId) {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            if (spreadsheet) {
                this.configure = new GSConfigure(spreadsheet);
                this.slack = new Slack(
                    this.configure.get('Slack Incoming URL'),
                    this.configure.get('無視するユーザ')
                );


                this.template = new Template(new TemplateStrageGs(spreadsheet));

                // this.template = new GSTemplate(spreadsheet);
                this.timesheets = new GSTimesheets(spreadsheet, this.configure);
                return true;

            }
            // var template = new GSTemplate(spreadsheet);
            // var slack = new Slack(settings.get('Slack Incoming URL'), template, settings);
            // var storage = new GSTimesheets(spreadsheet, settings);
            // var timesheets = new Timesheets(storage, settings, slack);
            // return({
            //     receiver: slack,
            //     timesheets: timesheets,
            //     storage: storage
            // });
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

}
