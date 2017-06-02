import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/Slack';
import CommandSignOut from '../src/command/command-sign-out';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';


const expectMessage = 'sss';
describe('SignOutCommand', ()=> {


  it('should call slack send method with expected message', () => {
    const date = moment();
    const username = "tester";
    const row = new TimesheetRow(username, date, ["","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);
    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);


    const command = new CommandSignOut(slack, null, timesheets);
    command.execute(username, date, "");

    mockSlack.verify();

    mockTimesheets.verify();
  });


  it('should call slack send method with mada syukkin sitenai message', () => {
    const date = moment();
    const username = "tester";
    const row = new TimesheetRow(username, date, ["","","","","","","",""]);
    const slack = new Slack();
    const timesheets = new Timesheets();
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);
    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);


    const command = new CommandSignOut(slack, null, timesheets);
    command.execute(username, date, "");

    mockSlack.verify();

    mockTimesheets.verify();
  });

});
