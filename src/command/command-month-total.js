import CommandAbstract from './command-abstract';
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

    var calculateMonth = TimesheetRow.getMonthTotal(user, month, year);
    this.slack.send(calculateMonth);

  }
}
