import CommandAbstract from './command-abstract';
import CommandDayTotal from './command-day-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandRestHours extends CommandAbstract{
  static match(body) {
    return body.match(/なかぬけ|中抜|休憩(?!なし)/);
  }

  /**
   *
   * @param slack {Slack}
   * @param template {GSTemplate}
   * @param timesheets {GSTimesheets}
   */
  constructor(slack, template, timesheets, commandDayTotal = null) {
      super(slack, template, timesheets);

      if (commandDayTotal) {
          this.commandDayTotal = commandDayTotal;
      } else {
          this.commandDayTotal = new CommandDayTotal(slack, template, timesheets);
      }
  }

  execute(username, date, time, body) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);
    body = String(body || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    if (row.getSignIn() && row.getSignIn() !== '-' && row.getSignOut() && row.getSignOut() !== '-') {
      // find needed keyword in body and get a number to its left (eg 3.5時間　-> 3.5)
      const find = "時間";

      let pos = body.search(find) - 1;

      let restTime = "";
      while (pos >= 0) {
        if (!isNaN(body.charAt(pos)) || body.charAt(pos) == ".") {
          restTime = body.charAt(pos) + restTime;
          pos--;
        }
        else break;
      }

      const workedHours = TimesheetRow.workedHours(row.getSignIn(), row.getSignOut(), restTime);

      row.setRestTime(String(restTime));
      row.setWorkedHours( (workedHours<=8) ? workedHours : "8" );
      row.setOvertimeHours( TimesheetRow.overtimeHours(workedHours) );

      this.timesheets.set(row);
      this.slack.send(this.template.render(
        "restHours", username, date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'), String(restTime)
      ));

      this.commandDayTotal.execute(username, date);

    }
    else if ((row.getSignIn() && row.getSignIn() !== '-') && (!row.getSignOut() || row.getSignOut() === '-')) {
      this.slack.send(this.template.render(
        "signOutFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
      ));
    }
    else {
      this.slack.send(this.template.render(
        "signInFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
      ));
    }
  }
}
