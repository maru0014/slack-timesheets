import CommandAbstract from './command-abstract';
import CommandDayTotal from './command-day-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandNoRest extends CommandAbstract{
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.noRest'), 'i');
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

  execute(username, date) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (row.getSignIn() && row.getSignIn() !== '-' && row.getSignOut() && row.getSignOut() !== '-') {
      const restTime = 0;
      const workedHours = TimesheetRow.workedHours(row.getSignIn(), row.getSignOut(), restTime);

      row.setRestTime(String(restTime));
      row.setWorkedHours( (workedHours<=8) ? workedHours : "8" );
      row.setOvertimeHours( TimesheetRow.overtimeHours(workedHours) );

      this.timesheets.set(row);
      this.slack.send(this.template.render(
        "noRest", username, date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
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
