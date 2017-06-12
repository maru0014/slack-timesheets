import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandRestHours from '../src/command/command-rest-hours';
import CommandTotal from '../src/command/command-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandRestHoursSpec', ()=> {


  it('should call slack send method with **didnotSignin** template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "didnotSignin", username, date.format("YYYY/MM/DD")).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandRestHours(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **signoutFirst** template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "signoutFirst", date? date.format('YYYY/MM/DD'): now.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandRestHours(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with expectMessage and NoRest template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 15:00:00","","1","4","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const commandTotal = new CommandTotal();

    const restTime = "2";
    const body = "6/1は"+restTime+"時間なかぬけでした";

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "なかぬけ", username, date.format("YYYY/MM/DD"), restTime).onCall(0).returns(expectMessage);
    const mockCommandTotal = sinon.mock(commandTotal).expects('execute').withArgs(username,date);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandRestHours(slack, template, timesheets, commandTotal);
    command.execute(username, date, body);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandTotal.verify();
  });
});
