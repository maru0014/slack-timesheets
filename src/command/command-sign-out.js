import CommandAbstract from './command-abstract';
import CommandTotal from './command-total';
import TimesheetRow from '../timesheet-row';

import moment from 'moment';

export default class CommandSignOut extends CommandAbstract{
  static match(body) {
    return body.match(/(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|退勤|ごきげんよ|グ[ッ]?バイ)/);
  }

  /**
   *
   * @param slack {Slack}
   * @param template {GSTemplate}
   * @param timesheets {GSTimesheets}
   */
  constructor(slack, template, timesheets, commandTotal = null) {
    super(slack, template, timesheets);

    if (commandTotal) {
      this.commandTotal = commandTotal;
    } else {
      this.commandTotal = new CommandTotal(slack, template, timesheets);
    }
  }

  execute(username, date, time) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (row.getSignIn()) {

      if (!row.getSignOut()) {
          let setterTime = time ? moment(date).format('YYYY/MM/DD ') + moment(time, "HH:mm").format('HH:mm') : now.format('YYYY/MM/DD HH:mm');
          let workedHours = TimesheetRow.workedHours(row.getSignIn(), setterTime, row.getRestTime());

          row.setSignOut(setterTime);
          row.setWorkedHours((workedHours <= 8) ? workedHours : "8");
          row.setOvertimeHours(TimesheetRow.overtimeHours(workedHours));
          row.setLateHours(TimesheetRow.lateHours(moment(row.getSignIn(), "YYYY/MM/DD HH:mm").format("YYYY/MM/DD HH:mm"), setterTime));

          this.timesheets.set(row);
          this.slack.send(this.template.render(
              "退勤", username, setterTime
          ));

          this.commandTotal.execute(username, date, time);

      } else {

          // 更新の場合は時間を明示する必要がある
          if (!time) {
            this.slack.send(this.template.render(
              "alreadySignedout", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
            ));
            return;
          }
          let setterTime = date.format('YYYY/MM/DD ') + moment(time, "HH:mm").format('HH:mm');
          let workedHours = TimesheetRow.workedHours(row.getSignIn(), setterTime, row.getRestTime());

          row.setSignOut(setterTime);
          row.setWorkedHours(workedHours <= 8 ? workedHours : "8");
          row.setOvertimeHours(TimesheetRow.overtimeHours(workedHours));
          row.setLateHours(TimesheetRow.lateHours(moment(row.getSignIn(), "YYYY/MM/DD HH:mm").format("YYYY/MM/DD HH:mm"), setterTime));

          this.timesheets.set(row);
          this.slack.send(this.template.render(
              "退勤更新", username, setterTime
          ));

          this.commandTotal.execute(username, date, time);

      }
    }
    else {
      this.slack.send(this.template.render(
        "signinFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
      ));
    }
  }
}
