import CommandAbstract from './command-abstract';

export default class CommandTotal extends CommandAbstract{
  static match(body) {
    return body.match(/何時間働|勤務時間/);
  }

  execute(username, date, time) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (row.getWorkedHours() && row.getWorkedHours() > 0) {
      this.slack.send(this.template.render(
        "合計時間", username, date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD'), row.getRestTime(), row.getWorkedHours()
      ));
    }

  }
}
