import DateTime from '../date-time';
import CommandHelp from './command-help';
import CommandSignIn from './command-sign-in';
import CommandSignOut from './command-sign-out';
import CommandDayTotal from "./command-day-total";
import CommandNoRest from "./command-no-rest";
import CommandRestHours from "./command-rest-hours";
import CommandMonthTotal from "./command-month-total";


export default class Dispatcher {

  constructor(kernel) {
    this.kernel = kernel;
  }

  dispatch(username, body) {
    const datetime = DateTime.parse(body, this.kernel.getI18n());

    const commands = [
      CommandSignOut,
      CommandSignIn,
      CommandDayTotal,
      CommandNoRest,
      CommandRestHours,
      CommandMonthTotal,
      CommandHelp
    ];


    commands.map((CommandClass) => {
      if (CommandClass.match(body, this.kernel.getI18n())) {
        const command = new CommandClass(this.kernel.getSlack(), this.kernel.getTemplate(), this.kernel.getTimesheets());
        command.execute(username, datetime.date, datetime.time, body);
      }
    });


  }
}
