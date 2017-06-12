import CommandAbstract from './command-abstract';

import moment from 'moment';

export default class CommandDayTotal extends CommandAbstract{
  static match(body) {
    return body.match(/何時間働|勤務時間/);
  }

  execute(username, date) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);


    if (row.getWorkedHours() && row.getWorkedHours() > 0) {

      const restTime = row.getRestTime()? row.getRestTime(): "0";
      const overtimeHours = row.getOvertimeHours()? row.getOvertimeHours(): "0";
      const lateHours = row.getLateHours()? row.getLateHours(): "0";

      this.slack.send(this.template.render(
        "dayTotal",
        username,
        date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'),
        moment(row.getSignIn(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
        moment(row.getSignOut(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
        row.getWorkedHours(),
        restTime,
        overtimeHours,
        lateHours
      ));
    }
    else {
      if (row.getSignIn() && !row.getSignOut() ){
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
}
