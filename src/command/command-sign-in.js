import CommandAbstract from './command-abstract';
import moment from 'moment';

export default class CommandSignIn extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.signIn'), 'i');
    return body.match(regex);
  }

  execute(username, date, time) {
    const now = moment();
    const row = this.timesheets.get(username, date ? date : now);
    if (!row.getSignIn() || row.getSignIn() === '-') {
      const setterTime = time ? (date ? date.format('YYYY/MM/DD ') : now.format('YYYY/MM/DD ')) + moment(time, "HH:mm").format('HH:mm') : now.format('YYYY/MM/DD HH:mm');
      row.setSignIn(setterTime);
      row.setRestTime("1");
      this.timesheets.set(row);
      this.slack.send(this.template.render(
        "signIn",

        username,
        setterTime
      ));
    } else {
      if (!time) {
        this.slack.send(this.template.render(
          "alreadySignedIn",

          username,
          date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
        ));
        return;
      }
      row.setSignIn((date ? date.format('YYYY/MM/DD ') : now.format('YYYY/MM/DD ')) + moment(time, "HH:mm").format('HH:mm'));

      this.timesheets.set(row);
      this.slack.send(this.template.render(
        "signInUpdate",

        username,
        (date ? date.format('YYYY/MM/DD ') : now.format('YYYY/MM/DD ')) + moment(time, "HH:mm").format('HH:mm')
      ));
    }
  }
}
