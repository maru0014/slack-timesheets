import CommandAbstract from './command-abstract';
import CommandDayTotal from './command-day-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandSignOut extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.signOut'), 'i');
    return body.match(regex);
  }

  /**
   *
   * @param slack {Slack}
   * @param template {TemplateStrageGs}
   * @param timesheets {GSTimesheets}
   * @param commandDayTotal {CommandDayTotal}
   */
  constructor(slack, template, timesheets, commandDayTotal = null) {
    super(slack, template, timesheets);
    if (commandDayTotal) {
      this.commandDayTotal = commandDayTotal;
    } else {
      this.commandDayTotal = new CommandDayTotal(slack, template, timesheets);
    }
  }

  execute(username, date, time) {
    const now = moment();
    const row = this.timesheets.get(username, date ? date : now);
    if (row.getSignIn()) {
      if (!row.getSignOut()) {
        const setterTime = time ? (date ? date.format('YYYY/MM/DD ') : now.format('YYYY/MM/DD ')) + moment(time, "HH:mm").format('HH:mm') : now.format('YYYY/MM/DD HH:mm');
        const workedHours = TimesheetRow.workedHours(row.getSignIn(), setterTime, row.getRestTime());
        row.setSignOut(setterTime);
        row.setWorkedHours((workedHours <= 8) ? workedHours : "8");
        row.setOvertimeHours(TimesheetRow.overtimeHours(workedHours));
        row.setLateHours(TimesheetRow.lateHours(moment(row.getSignIn(), "YYYY/MM/DD HH:mm").format("YYYY/MM/DD HH:mm"), setterTime));
        this.timesheets.set(row);
        this.slack.send(this.template.render(
            "signOut", username, setterTime
        ));
        this.commandDayTotal.execute(username, date, time);
      } else {
        if (!time) {
          this.slack.send(this.template.render(
              "alreadySignedOut", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
          ));
          return;
        }
        const setterTime = (date ? date.format('YYYY/MM/DD ') : now.format('YYYY/MM/DD ')) + moment(time, "HH:mm").format('HH:mm');
        const workedHours = TimesheetRow.workedHours(row.getSignIn(), setterTime, row.getRestTime());
        row.setSignOut(setterTime);
        row.setWorkedHours(workedHours <= 8 ? workedHours : "8");
        row.setOvertimeHours(TimesheetRow.overtimeHours(workedHours));
        row.setLateHours(TimesheetRow.lateHours(moment(row.getSignIn(), "YYYY/MM/DD HH:mm").format("YYYY/MM/DD HH:mm"), setterTime));
        this.timesheets.set(row);
        this.slack.send(this.template.render(
            "signOutUpdate", username, setterTime
        ));
        this.commandDayTotal.execute(username, date, time);
      }
    }
    else {
      this.slack.send(this.template.render(
          "signInFirst", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
      ));
    }
  }
}
