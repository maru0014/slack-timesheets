import CommandAbstract from './command-abstract';
import moment from 'moment';
import TimesheetRow from "../timesheet-row";

export default class CommandMonthTotal extends CommandAbstract{
  static match(body) {
    return body.match(/集計/);
  }

  execute(username, date, time, body) {

    let userReg = /:([^\s]+)/;
    let user = userReg.exec(body);
    user = user[1];

    let yearReg = /\d+(?=\/)/;
    let year = yearReg.exec(body);
    year = year[0];

    let monthReg = /\d+$/;
    let month = monthReg.exec(body);
    month = month[0]-1;

    let calculateMonth = CommandMonthTotal._getMonthTotal(user, month, year, this.timesheets, this.template);
    this.slack.send(calculateMonth);

  }


  static _getMonthTotal(username, month, year, timesheets, template) {


    const date = moment({year: year, month: month, day: 1});

    let actualMonth = month+1;

    let totalWorkedHours = 0;
    let totalOvertimeHours = 0;
    let totalLateHours = 0;

    while (date.month() == month) {

      const row = timesheets.get(username, date);


      if (row && row.getSignIn()) {
        const signIn = row.getSignIn();
        let _totalWorkedHours = parseFloat(row.getWorkedHours());
        if (_totalWorkedHours) {
          totalWorkedHours += _totalWorkedHours;
        }
        else {
          return template.render("didnotSignoutOn", username, moment(signIn, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD'));
        }

        let _totalOvertimeHours = parseFloat(row.getOvertimeHours());
        if (_totalOvertimeHours) {
          totalOvertimeHours += _totalOvertimeHours;
        }

        let _totalLateHours = parseFloat(row.getLateHours());
        if (_totalLateHours) {
          totalLateHours += _totalLateHours;
        }

      }
      date.add('1','days');

    }
    if (totalWorkedHours > 0) {
      return template.render("monthlyTotal", username, year+"/"+actualMonth, totalWorkedHours, totalOvertimeHours, totalLateHours);
    }
    else {
      return template.render("didnotWorkThatMonth", username, year+"/"+actualMonth);
    }

  }
}
