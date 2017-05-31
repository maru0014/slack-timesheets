import CommandAbstract from './command-abstract';
import moment from 'moment';
import TimesheetRow from "../timesheet-row";

export default class CommandMonthTotal extends CommandAbstract{
  static match(body) {
    return body.match(/集計/);
  }

  execute(username, date, time, body) {

    var userReg = /:([^\s]+)/;
    var user = userReg.exec(body);
    user = user[1];

    var yearReg = /\d+(?=\/)/;
    var year = yearReg.exec(body);
    year = year[0];

    var monthReg = /\d+$/;
    var month = monthReg.exec(body);
    month = month[0]-1;

    var calculateMonth = CommandMonthTotal._getMonthTotal(user, month, year, this.timesheets);
    this.slack.send(calculateMonth);

  }


  static _getMonthTotal(username, month, year, timesheets) {
    let matomeSheet = timesheets._getSheet(username);
    let lastRow = matomeSheet.getLastRow();
    let matomeRange = "B5:B" + lastRow;
    let matomeData = matomeSheet.getRange(matomeRange).getValues();
    let firstDay = null;
    let lastDay = 0;


    let workedHoursCol = "F";
    let overtimeHoursCol = "G";
    let lateHoursCol = "H";

    let actualMonth = month+1; //
    let helperStringInit = username+"さんが"+year+"年"+actualMonth+"月は";
    let helperStringHour = "時間";
    let helperStringWorkedHours = "就業:";
    let helperStringOvertimeHours = "、時間外労働:";
    let helperStringLateHours = "、深夜労働:";
    let helperStringFin = "働きました";


    for (let i = 0; i < matomeData.length; i++) {
      if (matomeData[i][0]){
        if (moment(matomeData[i][0]).month() == month && moment(matomeData[i][0]).year() == year) {
          firstDay = i + 5;
          break;
        }
      }
    }
    for (let j = matomeData.length-1; j >= 0; j--) {
      if (matomeData[j][0]) {
        if (moment(matomeData[j][0]).month() == month && moment(matomeData[j][0]).year() == year) {
          lastDay = j + 5;
          break;
        }
      }
    }

    if (firstDay != null && lastDay != null) {
      let totalWorkedHours = 0;
      let totalOvertimeHours = 0;
      let totalLateHours = 0;

      for (let n = firstDay; n <= lastDay; n++) {
        if (matomeSheet.getRange(workedHoursCol+n).getValue()) {
          totalWorkedHours += parseFloat(matomeSheet.getRange(workedHoursCol+n).getValue());

          let _totalOvertimeHours = parseFloat(matomeSheet.getRange(overtimeHoursCol+n).getValue());
          if (_totalOvertimeHours) {
            totalOvertimeHours += _totalOvertimeHours;
          }

          let _totalLateHours = parseFloat(matomeSheet.getRange(lateHoursCol+n).getValue());
          if (_totalLateHours) {
            totalLateHours += _totalLateHours;
          }

        }
      }
      return helperStringInit+helperStringWorkedHours+totalWorkedHours+helperStringHour+helperStringOvertimeHours+totalOvertimeHours+helperStringHour+helperStringLateHours+totalLateHours+helperStringHour+helperStringFin;
    }
    else {
      return helperStringInit+"出勤しませんでした";
    }

  }
}
