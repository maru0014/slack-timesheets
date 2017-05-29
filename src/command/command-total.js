import CommandAbstract from './command-abstract';

export default class CommandTotal extends CommandAbstract{
  static match(body) {
    return body.match(/何時間働|勤務時間/);
  }

  execute(username, date, time) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (row.getWorkedHours() && row.getWorkedHours() > 0) {

      let message = row.getRestTime()+"";

      if (row.getOvertimeHours()) {
        message += "時間、時間外ロード"+row.getOvertimeHours();
      }
      if (row.getLateHours()) {
        message += "時間、深夜ロード"+row.getLateHours();
      }

      this.slack.send(this.template.render(
        "合計時間", username, date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'), message, row.getWorkedHours()
      ));
    }
    else {
      if (row.getSignIn() && !row.getSignOut() ){
        this.slack.send(
          "@"+username+" "+(date? date.format('MM/DD'): now.format('MM/DD'))+"はまだ退勤してません"
        );
      }
      else {
        this.slack.send(
          "@"+username+" "+(date? date.format('MM/DD'): now.format('MM/DD'))+"は出勤してません"
        );
      }
    }

  }
}
