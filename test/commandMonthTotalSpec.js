import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandMonthTotal from '../src/command/command-month-total';
import CommandTotal from '../src/command/command-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import TeplateStrageArray from '../src/template-strage-array';


describe('CommandMonthTotalSpec', ()=> {
  it('should call slack send method with expectMessage', () => {
    const date = moment("2017/06/01", "YYYY/MM/DD");
    const username = "tester";
    const expectMessage = "Total hours in the given month";

    const row = new TimesheetRow(username, date, ["2017/06/01 00:00:00","2017/06/01 10:00:00","2017/06/01 19:00:00","","1","8","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();

    const year = date.year();
    const month = date.month();
    const actualMonth = month + 1;

    const body = "集計 :n.rashidov "+date.year()+"/"+actualMonth;

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandMonthTotal(slack, null, timesheets);


    const mockGetMonthTotal = sinon.mock(CommandMonthTotal).expects('_getMonthTotal').withArgs(username, month, year, timesheets);
    command.execute(username, date, null, body);

    mockSlack.verify();
    mockTimesheets.verify();
    mockGetMonthTotal.verify();
  });
});
