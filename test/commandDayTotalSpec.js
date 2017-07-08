import sinon from 'sinon';
import moment from 'moment';

import Slack from '../src/slack';
import CommandDayTotal from '../src/command/command-day-total';
import Timesheets from '../src/gs-timesheets';
import TimesheetRow from '../src/timesheet-row';
import Template from '../src/template';
import I18n from '../src/i18n';
import TemplateStrageArray from '../src/template-strage-array';


const expectMessage = "sample string";

describe('CommandDayTotalSpec', () => {

  let username, zeroCell, year, actualMonth, day, date, slack, i18n, timesheets, templateStrage, template;

  beforeEach(() => {
    username = "tester";

    zeroCell = "0";
    year = 2017;
    actualMonth = 6;
    day = 1;
    date = moment({year: year, month: actualMonth - 1, day: 1});

    slack = new Slack();
    templateStrage = new TemplateStrageArray();
    i18n = new I18n();
    timesheets = new Timesheets(i18n);
    template = new Template(templateStrage);
  });


  it('should call slack send method with **signOutFirst** template', () => {

    const row = new TimesheetRow(username, date, [year + "/" + actualMonth + "/" + day + " 00:00:00", year + "/" + actualMonth + "/" + day + " 10:00:00", "", "", "1", "", "", ""]);

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("signOutFirst", date.format('YYYY/MM/DD')).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandDayTotal(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **dayTotal** template on Worked Shift', () => {

    const row = new TimesheetRow(username, date, [year + "/" + actualMonth + "/" + day + " 00:00:00", year + "/" + actualMonth + "/" + day + " 10:00:00", year + "/" + actualMonth + "/" + day + " 23:00:00", "", "1", "8", "4", "1"]);

    const restTime = row.getRestTime() ? row.getRestTime() : "0";
    const overtimeHours = row.getOvertimeHours() ? row.getOvertimeHours() : "0";
    const lateHours = row.getLateHours() ? row.getLateHours() : "0";
    const note = row.getNote();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const mockTemplate = sinon.mock(template).expects('render').withArgs(
      "dayTotal",
      username,
      date.format("YYYY/MM/DD"),
      moment(row.getSignIn(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
      moment(row.getSignOut(), 'YYYY/MM/DD HH:mm').format("HH:mm"),
      row.getWorkedHours(),
      restTime,
      overtimeHours,
      lateHours,
      note
    ).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandDayTotal(slack, template, timesheets);
    command.execute(username, date);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });


  it('should call slack send method with **dayTotal** template on Cancelled Shift', () => {
    const row = new TimesheetRow(username, date, [year + "/" + actualMonth + "/" + day + " 00:00:00", "-", "-", i18n.__('timesheets.cancelShift'), "0", "0", "0", "0"]);

    const restTime = row.getRestTime() ? row.getRestTime() : "0";
    const overtimeHours = row.getOvertimeHours() ? row.getOvertimeHours() : "0";
    const lateHours = row.getLateHours() ? row.getLateHours() : "0";
    const note = row.getNote();

    const mockTimesheets = sinon.mock(timesheets).expects('get').withArgs(username, date).onCall(0).returns(row);
    sinon.mock(timesheets).expects('set').withArgs(row);
    const signIn = row.getSignIn()? row.getSignIn() : "-";
    const signOut = row.getSignOut()? row.getSignOut() : "-";
    const mockTemplate = sinon.mock(template).expects('render').withArgs(
      "dayTotal",
      username,
      date.format("YYYY/MM/DD"),
      signIn,
      signOut,
      row.getWorkedHours(),
      restTime,
      overtimeHours,
      lateHours,
      note
    ).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandDayTotal(slack, template, timesheets);
    command.execute(username, date, null, null, i18n);

    mockSlack.verify();
    mockTimesheets.verify();
    mockTemplate.verify();
  });
});
