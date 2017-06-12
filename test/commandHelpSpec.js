import sinon from 'sinon';
import i18n from 'i18n';

import Slack from '../src/slack';
import CommandHelp from '../src/command/command-help';
import Template from '../src/template';
import TemplateStrageArray from '../src/template-strage-array';



const expectMessage = "sample string";

describe('CommandHelpSpec', ()=> {
  // i18n.configure({
  //   defaultLocale: 'ja',
  //   directory: __dirname + '/../src/locales'
  // });
  //
  // var greeting = i18n.__('Hello %s, how are you today?', 'nodir');
  // console.log(greeting);

  it('should call slack send method with **help** template', () => {

    const slack = new Slack();
    const templateStrage = new TemplateStrageArray();
    const template = new Template(templateStrage);

    const mockTemplate = sinon.mock(template).expects('render').withArgs("help").onCall(0).returns(expectMessage);
    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);


    const command = new CommandHelp(slack, template, null);
    command.execute();

    mockSlack.verify();
  });
});
