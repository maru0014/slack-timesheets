import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/Slack';
import CommandNoRest from '../src/command/command-no-rest';
import CommandTotal from '../src/command/command-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TeplateStrageArray from '../src/template-strage-array';


describe('CommandNoRestSpec', ()=> {


  it('should call slack send method with --didnt work on that day-- message', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = "@"+username+" "+date.format('YYYY/MM/DD')+"は出勤してません";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandNoRest(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with --run this command after signing out-- message', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = "@"+username+" "+date.format('YYYY/MM/DD')+"このコマンドを退勤してから実行してください";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandNoRest(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with expectMessage and NoRest template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = "No rest time registered";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 15:00:00","","1","4","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TeplateStrageArray();
    const template = new Template(templateStrage);

    const commandTotal = new CommandTotal();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs( "休憩なし", username, date.format("YYYY/MM/DD")).onCall(0).returns(expectMessage);
    const mockCommandTotal = sinon.mock(commandTotal).expects('execute').withArgs(username,date);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandNoRest(slack, template, timesheets, commandTotal);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
    mockCommandTotal.verify();
  });


  // it('should call slack send method with --have not signed out yet-- message', () => {
  //   const date = moment("2017/06/01", "YYYY/MM/DD");
  //   const username = "tester";
  //   const expectMessage = "@"+username+" "+date.format('YYYY/MM/DD')+"はまだ退勤してません";
  //
  //   const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","1","","",""]);
  //   const slack = new Slack();
  //   const timesheets = new Timesheets();
  //   const templateStrage = new TeplateStrageArray();
  //   const template = new Template(templateStrage);
  //
  //   const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
  //   sinon.mock(timesheets).expects('set').withArgs(row);
  //   const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);
  //
  //
  //   const command = new CommandNoRest(slack, template, timesheets);
  //   command.execute(username, date);
  //
  //   mockSlack.verify();
  //   mockTimesheets.verify();
  // });
  //
  //
  // it('should call slack send method with expectedMessage and TotalHours template', () => {
  //   const date = moment("2017/06/01", "YYYY/MM/DD");
  //   const username = "tester";
  //   const expectMessage = "Total worked hours";
  //
  //   const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 23:00:00","","1","8","4","1"]);
  //   const slack = new Slack();
  //   const timesheets = new Timesheets();
  //   const templateStrage = new TeplateStrageArray();
  //   const template = new Template(templateStrage);
  //
  //   let restTime = row.getRestTime();
  //   if (!row.getRestTime()) {
  //     restTime = "0";
  //   }
  //   let message = restTime+"";
  //
  //   if (row.getOvertimeHours()) {
  //     message += "時間、時間外労働"+row.getOvertimeHours();
  //   }
  //   if (row.getLateHours()) {
  //     message += "時間、深夜労働"+row.getLateHours();
  //   }
  //
  //   const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
  //   sinon.mock(timesheets).expects('set').withArgs(row);
  //   const mockTemplate = sinon.mock(template).expects('render').withArgs( "合計時間", username, date.format("YYYY/MM/DD"), moment(row.getSignIn(), 'YYYY/MM/DD HH:mm').format("HH:mm"), moment(row.getSignOut(), 'YYYY/MM/DD HH:mm').format("HH:mm"), row.getWorkedHours(), message).onCall(0).returns(expectMessage);
  //   const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);
  //
  //
  //   const command = new CommandNoRest(slack, template, timesheets);
  //   command.execute(username, date);
  //
  //   mockSlack.verify();
  //   mockTimesheets.verify();
  //   mockTemplate.verify();
  // });
});
