import sinon from 'sinon';

import I18n from '../src/i18n';
import * as locales from '../src/locales';
import Slack from '../src/slack';
import CommandHelp from '../src/command/command-help';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';
import _ from 'lodash';



const expectMessage = "sample string";

describe('CommandHelpSpec', ()=> {

  let slack,templateStrage,template;


  beforeEach(() => {

    slack = new Slack();
    templateStrage = new TemplateStrageArray();
    template = new Template(templateStrage);
  });


  it('should call slack send method with **help** template', () => {

    console.log(_.keys(locales)[0]);
    const mockTemplate = sinon.mock(template).expects('render').withArgs("help").onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandHelp(slack, template, null);
    command.execute();

    mockSlack.verify();
    mockTemplate.verify();
  });
});
