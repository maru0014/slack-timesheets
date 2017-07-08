import CommandAbstract from './command-abstract';
import CommandDayTotal from './command-day-total';

import moment from 'moment';

export default class CommandCancelShift extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.cancelShift'), 'i');
    return body.match(regex);
  }

  /**
   *
   * @param slack {Slack}
   * @param template {TemplateStrageGs}
   * @param timesheets {GSTimesheets}
   * @param commandDayTotal {CommandDayTotal}
   */
  constructor(slack, template, timesheets, commandDayTotal = null) {
    super(slack, template, timesheets);
    if (commandDayTotal) {
      this.commandDayTotal = commandDayTotal;
    } else {
      this.commandDayTotal = new CommandDayTotal(slack, template, timesheets);
    }
  }

  execute(username, date, time, body, i18n) {
    const now = moment();
    const row = this.timesheets.get(username, date ? date : now);
    const blankCell = "-"; // value to be put in SignIn and SignOut cells
    const zeroCell = "0"; // value to be put in WorkedHours RestTime Overtime Latenight cells
    // Note cell is set in CommandDayTotal
    row.setSignIn(blankCell);
    row.setSignOut(blankCell);
    row.setRestTime(zeroCell);
    row.setWorkedHours(zeroCell);
    row.setOvertimeHours(zeroCell);
    row.setLateHours(zeroCell);

    this.timesheets.set(row);
    this.slack.send(this.template.render(
      "cancelShift", username, date.format("YYYY/MM/DD")
    ));
    this.commandDayTotal.execute(username, date, time, body, i18n);
  }
}
