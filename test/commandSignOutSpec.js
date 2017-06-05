import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/Slack';
import CommandSignOut from '../src/command/command-sign-out';
import CommandTotal from '../src/command/command-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TeplateStrageArray from '../src/template-strage-array';


describe('SignOutCommandSpec', ()=> {


  it('should call slack send method with --cant sign out without sign in-- message', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = "@" + username + "は今日まだ出勤押していません。出勤押してからまた退勤押してください";

    const time = "19:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignOut(slack, template, timesheets);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with --already signed out-- message', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = '今日はもう退勤してますよ';

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 19:00:00","","1","8","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignOut(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with expectMessage and Signout template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = 'Good bye';

    const time = "19:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","1","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const commandTotal = new CommandTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "退勤", username, date.format("YYYY/MM/DD ")+time).onCall(0).returns(expectMessage);
    const mockCommandTotal = sinon.mock(commandTotal).expects('execute').withArgs(username,date,time);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignOut(slack, template, timesheets, commandTotal);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandTotal.verify();
  });


  it('should call slack send method with expectMessage and SignoutUpdate template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = 'Updated good bye';

    const time = "20:00";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 19:00:00","","1","8","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const commandTotal = new CommandTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "退勤更新", username, date.format("YYYY/MM/DD ")+time).onCall(0).returns(expectMessage);
    const mockCommandTotal = sinon.mock(commandTotal).expects('execute').withArgs(username,date);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandSignOut(slack, template, timesheets, commandTotal);
    command.execute(username, date, time);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandTotal.verify();
  });
});
