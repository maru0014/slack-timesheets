import GSConfigure from './gs-configure';
import GSTemplate from './gs-template';
import moment from 'moment';
import _ from 'lodash';

export default class Installer {
  constructor() {
  }

  install(properties) {

    // タイムシートを作る
    var spreadsheet = SpreadsheetApp.create("Xearts Slack Timesheets");
    properties.set('spreadsheet', spreadsheet.getId());

    var sheets = spreadsheet.getSheets();
    if (sheets.length == 1 && sheets[0].getLastRow() == 0) {
      sheets[0].setName('_設定');
    }

    var configure = new GSConfigure(spreadsheet);
    configure.set('Slack Incoming URL', '');
    configure.setNote('Slack Incoming URL', 'Slackのincoming URLを入力してください');
    configure.set('開始日', moment().format("YYYY-MM-DD"));
    configure.setNote('開始日', '変更はしないでください');
    configure.set('無視するユーザ', 'miyamoto,hubot,slackbot,incoming-webhook');
    configure.setNote('無視するユーザ', '反応をしないユーザを,区切りで設定する。botは必ず指定してください。');

    // 休日を設定 (iCal)
    var calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
    var calendar = CalendarApp.getCalendarById(calendarId);
    var startDate = moment().toDate();
    var endDate = moment().add('years', 1).toDate();
    var holidays = _.map(calendar.getEvents(startDate, endDate), function (ev) {
      return moment(ev.getAllDayStartDate()).format("YYYY-MM-DD");
    });
    configure.set('休日', holidays.join(', '));
    configure.setNote('休日', '日付を,区切りで。来年までは自動設定されているので、以後は適当に更新してください');

    // メッセージ用のシートを作成
    new GSTemplate(spreadsheet);
  }
}
