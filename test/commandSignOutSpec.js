import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandSignOut from '../src/command/command-sign-out';
import CommandDayTotal from '../src/command/command-day-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import I18n from '../src/i18n';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandSignOutSpec', () => {

  let username, year, actualMonth, day, date, slack, i18n, timesheets, templateStrage, template;

  beforeEach(() => {
    username = "tester";

    year = 2017;
    actualMonth = 6;
    day = 1;
    date = moment({year: year, month: actualMonth - 1, day: 1});

    slack = new Slack();
    i18n = new I18n();
    timesheets = new Timesheets(i18n);
    templateStrage = new TemplateStrageArray();
    template = new Template(templateStrage);
  });


  it('should call slack send method with **signInFirst** template', () => {

    const time = "19:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00", "", "", "", "", "", "", ""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signInFirst", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandSignOut(slack, template, timesheets);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **alreadySignedOut** template', () => {

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00", "2017/06/01 10:00:00", "2017/06/01 19:00:00", "", "1", "8", "", ""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("alreadySignedOut", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandSignOut(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **signOut** template', () => {

    const time = "19:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00", "2017/06/01 10:00:00", "", "", "1", "", "", ""]);

    const commandDayTotal = new CommandDayTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signOut", username, date.format("YYYY/MM/DD ") + time).onCall(0).returns(expectMessage);

    const mockCommandDayTotal = sinon.mock(commandDayTotal).expects('execute').withArgs(username, date, time);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignOut(slack, template, timesheets, commandDayTotal);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandDayTotal.verify();
  });


  it('should call slack send method with **signOutUpdate** template', () => {

    const time = "20:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00", "2017/06/01 10:00:00", "2017/06/01 19:00:00", "", "1", "8", "", ""]);

    const commandDayTotal = new CommandDayTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signOutUpdate", username, date.format("YYYY/MM/DD ") + time).onCall(0).returns(expectMessage);

    const mockCommandDayTotal = sinon.mock(commandDayTotal).expects('execute').withArgs(username, date);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandSignOut(slack, template, timesheets, commandDayTotal);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandDayTotal.verify();
  });
});
