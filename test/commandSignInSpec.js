import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandSignIn from '../src/command/command-sign-in';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandSignInSpec', ()=> {


  it('should call slack send method with **alreadySignedin** template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","1","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "alreadySignedin", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignIn(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with expectMessage and SignIn template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const time = "10:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "出勤", username, date.format("YYYY/MM/DD ")+time).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignIn(slack, template, timesheets);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with expectMessage and SignInUpdate template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const time = "10:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 13:00:00","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "出勤更新", username, date.format("YYYY/MM/DD ")+time).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignIn(slack, template, timesheets);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });
});
