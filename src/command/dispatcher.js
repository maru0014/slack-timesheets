import DateTime from '../date-time';
import CommandCancelShift from './command-cancel-shift';
import CommandDayTotal from "./command-day-total";
import CommandHelp from './command-help';
import CommandMonthTotal from "./command-month-total";
import CommandNoRest from "./command-no-rest";
import CommandRestHours from "./command-rest-hours";
import CommandSignIn from './command-sign-in';
import CommandSignOut from './command-sign-out';

export default class Dispatcher {

  constructor(kernel) {
    this.kernel = kernel;
  }

  dispatch(username, body) {
    const datetime = DateTime.parse(body, this.kernel.getI18n());
    const commands = [
      CommandCancelShift,
      CommandDayTotal,
      CommandHelp,
      CommandMonthTotal,
      CommandNoRest,
      CommandRestHours,
      CommandSignIn,
      CommandSignOut
    ];
    commands.map((CommandClass) => {
      if (CommandClass.match(body, this.kernel.getI18n())) {
        const command = new CommandClass(this.kernel.getSlack(), this.kernel.getTemplate(), this.kernel.getTimesheets());
        command.execute(username, datetime.date, datetime.time, body, this.kernel.getI18n());
      }
    });
  }
}
