import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandNoRest from '../src/command/command-no-rest';
import CommandDayTotal from '../src/command/command-day-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandNoRestSpec', ()=> {

  let username,year,actualMonth,day,date,slack,timesheets,templateStrage,template;

  beforeEach(() => {
    username = "tester";

    year = 2017;
    actualMonth = 6;
    day = 1;
    date = moment({year: year, month: actualMonth-1, day: 1});

    slack = new Slack();
    timesheets = new Timesheets();
    templateStrage = new TemplateStrageArray();
    template = new Template(templateStrage);
  });


  it('should call slack send method with **signInFirst** template', () => {

    const row = new TimesheetRow(username, date, [year+"/"+actualMonth+"/"+day+" 00:00:00","","","","","","",""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "signInFirst", date.format("YYYY/MM/DD")).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandNoRest(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **signOutFirst** template', () => {

    const row = new TimesheetRow(username, date, [year+"/"+actualMonth+"/"+day+" 00:00:00",year+"/"+actualMonth+"/"+day+" 10:00:00","","","","","",""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "signOutFirst", date.format('YYYY/MM/DD') ).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandNoRest(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **noRest** template', () => {

    const row = new TimesheetRow(username, date, [year+"/"+actualMonth+"/"+day+" 00:00:00",year+"/"+actualMonth+"/"+day+" 10:00:00",year+"/"+actualMonth+"/"+day+" 15:00:00","","1","4","",""]);

    const commandDayTotal = new CommandDayTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "noRest", username, date.format("YYYY/MM/DD")).onCall(0).returns(expectMessage);

    const mockCommandDayTotal = sinon.mock(commandDayTotal).expects('execute').withArgs(username,date);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandNoRest(slack, template, timesheets, commandDayTotal);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandDayTotal.verify();
  });
});
