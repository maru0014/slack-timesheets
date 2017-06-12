import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandMonthTotal from '../src/command/command-month-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandMonthTotalSpec', ()=> {

  let username,year,actualMonth,day,date,slack,timesheets,templateStrage,template, body;

  beforeEach(() => {
    username = "tester";

    year = 2017;
    actualMonth = 6;
    day = 1;
    date = moment({year: year, month: actualMonth-1, day: 1});

    body = "集計 :"+username+" "+year+"/"+actualMonth;

    slack = new Slack();
    timesheets = new Timesheets();
    templateStrage = new TemplateStrageArray();
    template = new Template(templateStrage);
  });


  it('should call slack send method with **didnotWorkThatMonth** template', () => {

    const row = new TimesheetRow(username, date, ["","","","","","","",""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').atLeast(28).atMost(31)
      .onCall(0).returns(row)
      .onCall(1).returns(row)
      .onCall(2).returns(row)
      .onCall(3).returns(row)
      .onCall(4).returns(row)
      .onCall(5).returns(row)
      .onCall(6).returns(row)
      .onCall(7).returns(row)
      .onCall(8).returns(row)
      .onCall(9).returns(row)
      .onCall(10).returns(row)
      .onCall(11).returns(row)
      .onCall(12).returns(row)
      .onCall(13).returns(row)
      .onCall(14).returns(row)
      .onCall(15).returns(row)
      .onCall(16).returns(row)
      .onCall(17).returns(row)
      .onCall(18).returns(row)
      .onCall(19).returns(row)
      .onCall(20).returns(row)
      .onCall(21).returns(row)
      .onCall(22).returns(row)
      .onCall(23).returns(row)
      .onCall(24).returns(row)
      .onCall(25).returns(row)
      .onCall(26).returns(row)
      .onCall(27).returns(row)
      .onCall(28).returns(row)
      .onCall(29).returns(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("didnotWorkThatMonth", username, year+"/"+actualMonth).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandMonthTotal(slack, template, timesheets);
    command.execute(username, date, null, body);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **didnotSignOutOn** template', () => {

    const row = new TimesheetRow(username, date, [year+"/0"+actualMonth+"/01 00:00:00",year+"/0"+actualMonth+"/01 10:00:00","","","1","","",""]);
    const signIn = row.getSignIn();

    const mockTimesheets = sinon.mock(timesheets).expects('get').once().onCall(0).returns(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("didnotSignOutOn", username, moment(signIn, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD')).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandMonthTotal(slack, template, timesheets);
    command.execute(username, date, null, body);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **monthTotal** template', () => {

    const row = new TimesheetRow(username, date, [year+"/0"+actualMonth+"/01 00:00:00",year+"/0"+actualMonth+"/01 10:00:00",year+"/0"+actualMonth+"/01 23:00:00","","1","8","4","1"]);
    const emptyRow = new TimesheetRow(username, date, ["","","","","","",""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').atLeast(28).atMost(31)
      .onCall(0).returns(row)
      .onCall(1).returns(emptyRow)
      .onCall(2).returns(emptyRow)
      .onCall(3).returns(emptyRow)
      .onCall(4).returns(emptyRow)
      .onCall(5).returns(emptyRow)
      .onCall(6).returns(emptyRow)
      .onCall(7).returns(emptyRow)
      .onCall(8).returns(emptyRow)
      .onCall(9).returns(emptyRow)
      .onCall(10).returns(emptyRow)
      .onCall(11).returns(emptyRow)
      .onCall(12).returns(emptyRow)
      .onCall(13).returns(emptyRow)
      .onCall(14).returns(emptyRow)
      .onCall(15).returns(emptyRow)
      .onCall(16).returns(emptyRow)
      .onCall(17).returns(emptyRow)
      .onCall(18).returns(emptyRow)
      .onCall(19).returns(emptyRow)
      .onCall(20).returns(emptyRow)
      .onCall(21).returns(emptyRow)
      .onCall(22).returns(emptyRow)
      .onCall(23).returns(emptyRow)
      .onCall(24).returns(emptyRow)
      .onCall(25).returns(emptyRow)
      .onCall(26).returns(emptyRow)
      .onCall(27).returns(emptyRow)
      .onCall(28).returns(emptyRow)
      .onCall(29).returns(emptyRow);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("monthTotal", username, year+"/"+actualMonth).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandMonthTotal(slack, template, timesheets);
    command.execute(username, date, null, body);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });
});