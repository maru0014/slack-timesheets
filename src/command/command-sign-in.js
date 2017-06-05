import CommandAbstract from './command-abstract';
import moment from 'moment';

export default class CommandSignIn extends CommandAbstract{
  static match(body) {
    return body.match(/(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|出勤)/);
  }
  execute(username, date, time) {

    const now = moment();
    const row = this.timesheets.get(username, date? date: now);

    if (!row.getSignIn() || row.getSignIn() === '-') {

      let setterTime = time? (date? date.format('YYYY/MM/DD '): now.format('YYYY/MM/DD '))+moment(time,"HH:mm").format('HH:mm'): now.format('YYYY/MM/DD HH:mm');

      row.setSignIn(setterTime);
      row.setRestTime("1");
      this.timesheets.set(row);

      this.slack.send(this.template.render(
          "出勤", username, setterTime
      ));

    } else {

      // 更新の場合は時間を明示する必要がある
      if (!time) {
        this.slack.send("今日はもう出勤してますよ");
        return;
      }
      row.setSignIn(date.format('YYYY/MM/DD ') + moment(time,"HH:mm").format('HH:mm'));

      this.timesheets.set(row);
      this.slack.send(this.template.render(
          "出勤更新", username, date.format('YYYY/MM/DD ') + moment(time,"HH:mm").format('HH:mm')
      ));
    }

  }
}
