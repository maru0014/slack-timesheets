import GSConfigure from './gs-configure';
import GSTemplate from './template-strage-gs';
import moment from 'moment';

export default class Installer {
  constructor() {
  }

  install(properties) {

    // タイムシートを作る
    const spreadsheet = SpreadsheetApp.create("Xearts Slack Timesheets");
    properties.set('spreadsheet', spreadsheet.getId());

    const sheets = spreadsheet.getSheets();
    if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
      sheets[0].setName('_Settings');
    }

    const configure = new GSConfigure(spreadsheet);
    configure.set('Slack Incoming URL', '');
    configure.setNote('Slack Incoming URL', 'Paste the Slack Incoming URL');
    configure.set('StartDate', moment().format("YYYY-MM-DD"));
    configure.setNote('StartDate', 'Please do not change this field');
    configure.set('IgnoredUsers', 'slackbot,incoming-webhook,timesheets');
    configure.setNote('IgnoredUsers', 'Set the users that you want to be ignored. Make sure the bot name you are using for the slack timesheets channel is also included here');
    configure.set('Language', 'en');
    configure.setNote('Language', 'Please dont change the language setting manujally. Run a command in slack instead');

    // create sheet for messages
    new GSTemplate(spreadsheet);
  }
}
