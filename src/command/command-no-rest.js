import CommandAbstract from './command-abstract';
import CommandTotal from './command-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandNoRest extends CommandAbstract{
  static match(body) {
    return body.match(/休憩なし/);
  }

  /**
   *
   * @param slack {Slack}
   * @param template {GSTemplate}
   * @param timesheets {GSTimesheets}
   */
  constructor(slack, template, timesheets) {
    super(slack, template, timesheets);

    this.commandTotal = new CommandTotal(slack, template, timesheets);
  }

  execute(username, date, time) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (row.getSignIn() && row.getSignIn() !== '-' && row.getSignOut() && row.getSignOut() !== '-') {
      let restTime = 0;
      let workedHours = TimesheetRow.workedHours(row.getSignIn(), row.getSignOut(), restTime);

      row.setRestTime(String(restTime));
      row.setWorkedHours( (workedHours<=8) ? workedHours : "8" );
      row.setOvertimeHours( TimesheetRow.overtimeHours(workedHours) );

      this.timesheets.set(row);
      this.slack.send(this.template.render(
        "休憩なし", username, date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
      ));

      this.commandTotal.execute(username, date, time);

    }
    else if ((row.getSignIn() && row.getSignIn() !== '-') && (!row.getSignOut() || row.getSignOut() === '-')) {
      this.slack.send(
        "@"+username+" "+(date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'))+"このコマンドを退勤してから実行してください"
      );
    }
    else {
      this.slack.send(
        "@"+username+" "+(date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'))+"は出勤してません"
      );
    }
  }
}
