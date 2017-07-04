import CommandAbstract from './command-abstract';
import CommandDayTotal from './command-day-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandRestHours extends CommandAbstract {
  static match(body, i18n) {
    this.i18n = i18n;
    const regex = new RegExp(i18n.__('commands.restHours'), 'i');
    return body.match(regex);
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

  execute(username, date, time, body, i18n) {
    const now = moment();
    const row = this.timesheets.get(username, date ? date : now);
    body = String(body || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    if (row.getSignIn() && row.getSignIn() !== '-' && row.getSignOut() && row.getSignOut() !== '-') {
      // find needed keyword in body and get a number to its left (eg 3.5hours　-> 3.5)
      let restTime = "";
      const find = i18n.__('dateTimeSettings.hours');
      const regex = new RegExp('(\\d*\\.?\\d)\\s*'+find, 'i'); // regex to match the break hours -- I took a 3.5 hour break
      const matches = body.match(regex);
      if (matches) {
        restTime = matches[1];
      }
      else {
        return;
      }
      const workedHours = TimesheetRow.workedHours(row.getSignIn(), row.getSignOut(), restTime);
      row.setRestTime(String(restTime));
      row.setWorkedHours((workedHours <= 8) ? workedHours : "8");
      row.setOvertimeHours(TimesheetRow.overtimeHours(workedHours));
      this.timesheets.set(row);
      this.slack.send(this.template.render(
          "restHours", username, date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD'), String(restTime)
      ));
      this.commandDayTotal.execute(username, date);
    }
    else if ((row.getSignIn() && row.getSignIn() !== '-') && (!row.getSignOut() || row.getSignOut() === '-')) {
      this.slack.send(this.template.render(
          "signOutFirst", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
      ));
    }
    else {
      this.slack.send(this.template.render(
          "signInFirst", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
      ));
    }
  }
}
