import CommandAbstract from './command-abstract';
import moment from 'moment';

export default class CommandMonthTotal extends CommandAbstract{
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.monthTotal'), 'i');
    return body.match(regex);
  }

  execute(username, date, time, body) {

    const userReg = /:([^\s]+)/;
    let user = userReg.exec(body);
    user = user[1];

    const yearReg = /\d+(?=\/)/;
    let year = yearReg.exec(body);
    year = year[0];

    const monthReg = /\d+$/;
    let month = monthReg.exec(body);
    month = month[0]-1;

    const calculateMonth = CommandMonthTotal._getMonthTotal(user, month, year, this.timesheets, this.template);
    this.slack.send(calculateMonth);

  }


  static _getMonthTotal(username, month, year, timesheets, template) {


    const date = moment({year: year, month: month, day: 1});

    const actualMonth = month+1;

    let totalWorkedHours = 0;
    let totalOvertimeHours = 0;
    let totalLateHours = 0;

    while (date.month() === month) {

      const row = timesheets.get(username, date);


      if (row && row.getSignIn()) {
        const signIn = row.getSignIn();
        const _totalWorkedHours = parseFloat(row.getWorkedHours());
        if (_totalWorkedHours) {
          totalWorkedHours += _totalWorkedHours;
        }
        else {
          return template.render("didnotSignOutOn", username, moment(signIn, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD'));
        }

        const _totalOvertimeHours = parseFloat(row.getOvertimeHours());
        if (_totalOvertimeHours) {
          totalOvertimeHours += _totalOvertimeHours;
        }

        const _totalLateHours = parseFloat(row.getLateHours());
        if (_totalLateHours) {
          totalLateHours += _totalLateHours;
        }

      }
      date.add('1','days');

    }
    if (totalWorkedHours > 0) {
      return template.render("monthTotal", username, year+"/"+actualMonth, totalWorkedHours, totalOvertimeHours, totalLateHours);
    }
    else {
      return template.render("didnotWorkThatMonth", username, year+"/"+actualMonth);
    }

  }
}
