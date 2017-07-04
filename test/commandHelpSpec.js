import sinon from 'sinon';

import I18n from '../src/i18n';
import * as locales from '../src/locales';
import moment from 'moment';
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

    let str = "I signed in at 18oclock";
    const i18n = new I18n("en");

      str = String(str || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });

// const reg = new RegExp("((\\d{1,2})\\s*[:"+i18n.__('dateTimeSettings.oclock')+"]{1}\\s*(\\d{1,2})\\s*("+i18n.__('dateTimeSettings.pm')+"|)|("+i18n.__('dateTimeSettings.pm')+")|("+i18n.__('dateTimeSettings.am')+"|"+i18n.__('dateTimeSettings.pm')+")\\s*(\\d{1,2})(\\s*[:"+i18n.__('dateTimeSettings.oclock')+"]\\s*(\\d{1,2})|)|(\\d{1,2})(\\s*[:"+i18n.__('dateTimeSettings.oclock')+"]{1}\\s*(\\d{1,2})|)("+i18n.__('dateTimeSettings.am')+"|"+i18n.__('dateTimeSettings.pm')+")|(\\d{1,2})\\s*"+i18n.__('dateTimeSettings.oclock')+")", 'i');
// const reg = /((\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|)|(am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|)|(\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm)|(\d{1,2})\s*時)/;
const reg = new RegExp('((\\d{1,2})\\s*[:'+i18n.__('dateTimeSettings.oclock')+']{1}\\s*(\\d{1,2})\\s*('+i18n.__('dateTimeSettings.am')+'|'+i18n.__('dateTimeSettings.pm')+'|)|(\\d{1,2})('+i18n.__('dateTimeSettings.am')+'|'+i18n.__('dateTimeSettings.pm')+')|(\\d{1,2})\\s*'+i18n.__('dateTimeSettings.oclock')+')', 'i');
    const matches = str.match(reg);
      console.log(matches);
      if(matches) {
        let hour, min;

        // 10:30, 17:30, 8:30am, 5:00pm, etc
        if(matches[2] != null) {
          hour = parseInt(matches[2]);
          min = parseInt(matches[3] ? matches[3] : '0');
        }

        // 9am, 5pm
        if(matches[5] != null) {
          hour = parseInt(matches[5]);
        }
        if (matches.indexOf(i18n.__("dateTimeSettings.pm")) > -1) {
          hour += 12;
        }

        // 9oclock, 18oclock
        if(matches[7] != null) {
          hour = parseInt(matches[7]);
        }
        console.log(moment({hour: hour, minute: min}).format("HH:mm"));
      }

    const mockTemplate = sinon.mock(template).expects('render').withArgs("help").onCall(0).returns(expectMessage);

    const mockSlack = sinon.mock(slack).expects('send').once().withArgs(expectMessage);

    const command = new CommandHelp(slack, template, null);
    command.execute();

    mockSlack.verify();
    mockTemplate.verify();
  });
});
