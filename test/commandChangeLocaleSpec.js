import sinon from 'sinon';

import I18n from '../src/i18n';
import * as locales from '../src/locales';
import moment from 'moment';
import Slack from '../src/slack';
import CommandChangeLocale from '../src/command/command-change-locale';
import Timesheets from '../src/gs-timesheets';
import Template from '../src/template';
import Config from '../src/gs-configure';
import TemplateStrageArray from '../src/template-strage-array';
import _ from 'lodash';


const expectMessage = "sample string";

class SpleadSheetMock {
  constructor() {

  }

  getSheetByName(name) {
    return {}
  }

}

describe('CommandChangeLocaleSpec', () => {

  let username, year, actualMonth, day, date, confLabel, newLocale, body, slack, i18n, timesheets, templateStrage,
    template, config;

  beforeEach(() => {
    username = "tester";

    year = 2017;
    actualMonth = 6;
    day = 1;
    date = moment({year: year, month: actualMonth - 1, day: 1});

    confLabel = "Language";

    slack = new Slack();
    i18n = new I18n();
    timesheets = new Timesheets(i18n);
    templateStrage = new TemplateStrageArray();
    template = new Template(templateStrage);
    config = new Config(new SpleadSheetMock());
  });

  it('should call slack send method with **changeLocale** template on existing locale', () => {
    newLocale = "ja";
    body = "change locale to " + newLocale;

    const mockConfig = sinon.mock(config).expects('set').withArgs(confLabel, newLocale).onCall(0).returns(newLocale);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("changeLocale", username).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);
    const command = new CommandChangeLocale(slack, template, null);
    command.execute(username, date, null, body, i18n, config);

    mockSlack.verify();
    mockTemplate.verify();
    mockConfig.verify();
  });

  it('should call slack send method with **changeLocaleFailed** template on non-existent locale', () => {
    newLocale = "es";
    body = "change locale to " + newLocale;

    const mockConfig = sinon.mock(config).expects('set').withArgs(confLabel, newLocale).never();
    const mockTemplate = sinon.mock(template).expects('render').withArgs("changeLocaleFailed", username).onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandChangeLocale(slack, template, null);
    command.execute(username, date, null, body, i18n, config);

    mockSlack.verify();
    mockTemplate.verify();
    mockConfig.verify();
  });
});
