import _ from 'lodash';
import moment from 'moment';
import TimesheetRow from './timesheet-row';

export default class GSTimesheets {
  /**
   *
   * @param spreadsheet
   * @param configure
   */
  constructor(spreadsheet, configure) {
    this.spreadsheet = spreadsheet;
    this.configure = configure;

    this._sheets = {};

    this.scheme = {
      columns: [
        { name: '日付' },
        { name: '出勤' },
        { name: '退勤' },
        { name: 'ノート' },
        { name: '休憩' },
        { name: '就業時間' },
        { name: '累計' }
      ],
      properties: [
        { name: 'DayOff', value: '土,日', comment: '← 月,火,水みたいに入力してください。アカウント停止のためには「全部」と入れてください。'},
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
      if(!sheet) {
        throw "エラー: "+sheetName+"のシートが作れませんでした";
      } else {
        // 中身が無い場合は新規作成
        if(sheet.getLastRow() == 0) {
          // 設定部の書き出し
          var properties = [["Properties count", this.scheme.properties.length, null]];
          this.scheme.properties.forEach(function(s) {
            properties.push([s.name, s.value, s.comment]);
          });
          sheet.getRange("A1:C"+(properties.length)).setValues(properties);

          // ヘッダの書き出し
          const rowNo = properties.length + 2;
          const cols = this.scheme.columns.map(function(c) { return c.name; });
          sheet.getRange("A"+rowNo+":"+String.fromCharCode(65 + cols.length - 1)+rowNo).setValues([cols]);
          sheet.getRange("B5:B").setNumberFormat("H:MM");
          sheet.getRange("C5:C").setNumberFormat("H:MM");
        }
        //this.on("newUser", username);
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
    const startRowNo = this.scheme.properties.length + 7;
    const startDate = moment(this.configure.get("開始日"));

    return startRowNo + date.diff(startDate, 'days');
  }

  /**
   *
   * @param username {String}
   * @param date {Moment}
   * @returns {TimesheetRow}
   */
  get(username, date) {
    var sheet = this._getSheet(username);
    var rowNo = this._getRowNo(username, date);
    var row = sheet.getRange("A"+rowNo+":"+String.fromCharCode(65 + this.scheme.columns.length - 1)+rowNo).getValues()[0].map(function(v) {
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
    var sheet = this._getSheet(row.getUsername());
    var rowNo = this._getRowNo(row.getUsername(), row.getDate());

    sheet.getRange("A"+rowNo+":"+String.fromCharCode(65 + this.scheme.columns.length - 1)+rowNo)
      .setValues([row.getRow().map((v) => v? v: '')]);

    return this;
  }

  getUsers() {
    return _.compact(_.map(this.spreadsheet.getSheets(), function(s) {
      var name = s.getName();
      return String(name).substr(0, 1) == '_' ? undefined : name;
    }));
  }


  /**
   *
   * @param date {Moment}
   * @returns {Array}
   */
  getByDate(date) {
    var self = this;
    return _.map(this.getUsers(), function(username) {
      return self.get(username, date);
    });
  }

  // 休みの曜日を数字で返す
  getDayOff(username) {
    var sheet = this._getSheet(username);
    return DateUtils.parseWday(sheet.getRange("B2").getValue());
  }

  // １ヶ月分の集計
  getMonthTotal(username, month, year) {
    var matomeSheet = this._getSheet(username);
    var lastRow = matomeSheet.getLastRow();
    var matomeRange = "B5:B" + lastRow;
    var matomeData = matomeSheet.getRange(matomeRange).getValues();
    var firstDay = null;
    var lastDay = 0;

    var actualMonth = month+1;
    var helperStringInit = username+"さんが"+year+"年"+actualMonth+"月には";
    var helperStringFin = "時間働きました";

    for (var i = 0; i < matomeData.length; i++) {
      if (matomeData[i][0]){
        if (matomeData[i][0].getMonth() == month && matomeData[i][0].getYear() == year) {
          firstDay = i + 5;
          break;
        }
      }
    }
    for (var j = matomeData.length-1; j >= 0; j--) {
      if (matomeData[j][0]) {
        if (matomeData[j][0].getMonth() == month && matomeData[j][0].getYear() == year) {
          lastDay = j + 5;
          break;
        }
      }
    }

    if (firstDay != null && lastDay != null) {
      var hoursData = 0;
      for (var n = firstDay; n <= lastDay; n++) {
        if (matomeSheet.getRange("F"+n).getValue()) {
          hoursData += parseFloat(matomeSheet.getRange("F"+n).getValue());
        }
      }
      return helperStringInit+hoursData+helperStringFin;
    }
    else {
      return helperStringInit+"出勤しませんでした";
    }

  };

}
