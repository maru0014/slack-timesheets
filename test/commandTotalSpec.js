import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandTotal from '../src/command/command-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandTotalSpec', ()=> {


  it('should call slack send method with **signinFirst** template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signinFirst", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandTotal(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **signoutFirst** template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","","","1","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signoutFirst", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandTotal(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
  });


  it('should call slack send method with expectedMessage and TotalHours template', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 23:00:00","","1","8","4","1"]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    let restTime = row.getRestTime()? row.getRestTime(): "0";
    let overtimeHours = row.getOvertimeHours()? row.getOvertimeHours(): "0";
    let lateHours = row.getLateHours()? row.getLateHours(): "0";

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs(
      "合計時間",
      username,
      date.format("YYYY/MM/DD"),
      moment(row.getSignIn(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
      moment(row.getSignOut(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
      row.getWorkedHours(),
      restTime,
      overtimeHours,
      lateHours
    ).onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandTotal(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });
});
