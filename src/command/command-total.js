import CommandAbstract from './command-abstract';

import moment from 'moment';

export default class CommandTotal extends CommandAbstract{
  static match(body) {
    return body.match(/何時間働|勤務時間/);
  }

  execute(username, date) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);


    if (row.getWorkedHours() && row.getWorkedHours() > 0) {

      let restTime = row.getRestTime()? row.getRestTime(): "0";
      let overtimeHours = row.getOvertimeHours()? row.getOvertimeHours(): "0";
      let lateHours = row.getLateHours()? row.getLateHours(): "0";

      this.slack.send(this.template.render(
        "合計時間",
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
          "signoutFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
        ));
      }
      else {
        this.slack.send(this.template.render(
          "signinFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')
        ));
      }
    }

  }
}
