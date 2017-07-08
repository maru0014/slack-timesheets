import CommandAbstract from './command-abstract';

import moment from 'moment';

export default class CommandDayTotal extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.dayTotal'), 'i');
    return body.match(regex);
  }

  execute(username, date, time, body, i18n) {

    const now = moment();
    const row = this.timesheets.get(username, date ? date : now);

    if ((row.getWorkedHours() && row.getWorkedHours() > 0) || row.getSignIn() == '-') {

      const signIn = row.getSignIn() == '-' ? "-" : moment(row.getSignIn(), 'YYYY/MM/DD HH:mm').format("HH:mm");
      const signOut = row.getSignOut() == '-' ? "-" : moment(row.getSignOut(), 'YYYY/MM/DD HH:mm').format("HH:mm");
      if (signIn == '-' && signOut == '-') {
        row.setNote(i18n.__('timesheets.cancelShift')); // set Note to cancelled shift string
      }
      else {
        row.setNote("");
      }
      this.timesheets.set(row);
      const restTime = row.getRestTime() ? row.getRestTime() : "0";
      const overtimeHours = row.getOvertimeHours() ? row.getOvertimeHours() : "0";
      const lateHours = row.getLateHours() ? row.getLateHours() : "0";
      const note = row.getNote() ? row.getNote() : "";

      this.slack.send(this.template.render(
        "dayTotal",
        username,
        date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD'),
        signIn,
        signOut,
        row.getWorkedHours(),
        restTime,
        overtimeHours,
        lateHours,
        note
      ));
    }
    else {
      if (row.getSignIn() && !row.getSignOut()) {
        this.slack.send(this.template.render(
          "signOutFirst", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
        ));
      }
      else {
        this.slack.send(this.template.render(
          "signInFirst", date ? date.format('YYYY/MM/DD') : now.format('YYYY/MM/DD')
        ));
      }
    }
  }
}
