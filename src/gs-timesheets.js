import _ from 'lodash';
import moment from 'moment';
import TimesheetRow from './timesheet-row';

export default class GSTimesheets {
  /**
   *
   * @param spreadsheet
   * @param configure
   * @param i18n
   */
  constructor(i18n, spreadsheet, configure) {
    this.spreadsheet = spreadsheet;
    this.configure = configure;

    this._sheets = {};
    this.scheme = {
      columns: [
        {name: i18n.__('timesheets.date')},
        {name: i18n.__('timesheets.signIn')},
        {name: i18n.__('timesheets.signOut')},
        {name: i18n.__('timesheets.note')},
        {name: i18n.__('timesheets.restTime')},
        {name: i18n.__('timesheets.workedHours')},
        {name: i18n.__('timesheets.overtimeHours')},
        {name: i18n.__('timesheets.latenightHours')}
      ]
    };
  };

  /**
   *
   * @param username {String}
   * @param create {boolean}
   * @returns {*}
   * @private
   */
  _getSheet(username, create = true) {
    if (this._sheets[username]) return this._sheets[username];

    let sheet = this.spreadsheet.getSheetByName(username);
    if (!sheet && create) {
      sheet = this.spreadsheet.insertSheet(username);
      if (!sheet) {
        throw "エラー: " + sheetName + "のシートが作れませんでした";
      } else {
        // add content if the sheet is empty
        if (sheet.getLastRow() == 0) {

          // Timesheet header
          const cols = this.scheme.columns.map(function (c) {
            return c.name;
          });
          sheet.getRange("A1:" + String.fromCharCode(65 + cols.length - 1) + "1").setValues([cols]);
          sheet.getRange("B2:B").setNumberFormat("hh:mm");
          sheet.getRange("C2:C").setNumberFormat("hh:mm");
        }
      }
    }

    this._sheets[username] = sheet;

    return sheet;
  }

  /**
   *
   * @param username {String}
   * @param date {Moment}
   * @returns {int}
   * @private
   */
  _getRowNo(username, date = moment()) {
    const startRowNo = 5;
    const startDate = moment(this.configure.get("StartDate"));

    return startRowNo + date.diff(startDate, 'days');
  }

  /**
   *
   * @param username {String}
   * @param date {Moment}
   * @returns {TimesheetRow}
   */
  get(username, date) {
    const sheet = this._getSheet(username);
    const rowNo = this._getRowNo(username, date);

    if (rowNo <= 1) {
      return null;
    }

    const row = sheet.getRange("A" + rowNo + ":" + String.fromCharCode(65 + this.scheme.columns.length - 1) + rowNo).getValues()[0].map(function (v) {
      return v === '' ? undefined : v;
    });

    if (row) {
      return new TimesheetRow(username, date, row);
    }
  }

  /**
   *
   * @param row {TimesheetRow}
   * @returns {GSTimesheets}
   */
  set(row) {
    const sheet = this._getSheet(row.getUsername());
    const rowNo = this._getRowNo(row.getUsername(), row.getDate());

    sheet.getRange("A" + rowNo + ":" + String.fromCharCode(65 + this.scheme.columns.length - 1) + rowNo)
        .setValues([row.getRow().map((v) => v ? v : '')]);

    return this;
  }

  getUsers() {
    return _.compact(_.map(this.spreadsheet.getSheets(), function (s) {
      const name = s.getName();
      return String(name).substr(0, 1) == '_' ? undefined : name;
    }));
  }


  /**
   *
   * @param date {Moment}
   * @returns {Array}
   */
  getByDate(date) {
    const self = this;
    return _.map(this.getUsers(), function (username) {
      return self.get(username, date);
    });
  }

}
