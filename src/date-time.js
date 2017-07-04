import moment from 'moment';
import _ from 'lodash';

export default class DateTime {

  /**
   *
   * @param date {Moment|null}
   * @param time {Moment|null}
   */
  constructor(date, time) {
    this.date = date;
    this.time = time;
  }


  static parse(str, i18n) {
    str = String(str || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    let date = DateTime.parseDate(str, i18n);
    let time = DateTime.parseTime(str, i18n);

    return new DateTime(date, time);
  }

  // get time from string
  static parseTime(str, i18n) {

    const reg = new RegExp('((\\d{1,2})\\s*[:' + i18n.__('dateTimeSettings.oclock') + ']{1}\\s*(\\d{1,2})\\s*(' + i18n.__('dateTimeSettings.am') + '|' + i18n.__('dateTimeSettings.pm') + '|)|(\\d{1,2})(' + i18n.__('dateTimeSettings.am') + '|' + i18n.__('dateTimeSettings.pm') + ')|(\\d{1,2})\\s*' + i18n.__('dateTimeSettings.oclock') + ')', 'i');
    const matches = str.match(reg);
    console.log(matches);
    if (matches) {
      let hour, min;

      // 10:30, 17:30, 8:30am, 5:00pm, etc
      if (matches[2] != null) {
        hour = parseInt(matches[2]);
        min = parseInt(matches[3] ? matches[3] : '0');
      }

      // 9am, 5pm, etc
      if (matches[5] != null) {
        hour = parseInt(matches[5]);
      }

      // 5pm, 3:30pm, etc -> 17:00, 15:30, etc
      if (matches.indexOf(i18n.__("dateTimeSettings.pm")) > -1) {
        hour += 12;
      }

      // 9oclock, 18oclock, etc
      if (matches[7] != null) {
        hour = parseInt(matches[7]);
      }
      return moment({hour: hour, minute: min});
    }
    return null;
  };

  // get date from string
  static parseDate(str, i18n) {

    const regTomorrow = new RegExp(i18n.__('dateTimeSettings.tomorrow'), 'i');
    if (str.match(regTomorrow)) {
      return moment().add('days', 1).startOf('day');
    }

    const regToday = new RegExp(i18n.__('dateTimeSettings.today'), 'i');
    if (str.match(regToday)) {
      return moment().startOf('day');
    }

    const regYesterday = new RegExp(i18n.__('dateTimeSettings.yesterday'), 'i');
    if (str.match(regYesterday)) {
      return moment().add('days', -1).startOf('day');
    }

    const reg = /((\d{4})[-\/年]{1})(\d{1,2})[-\/月]{1}(\d{1,2})/;
    const matches = str.match(reg);
    if (matches) {
      let year = parseInt(matches[2]);
      let month = parseInt(matches[3]);
      let day = parseInt(matches[4]);
      const now = moment();
      if (_.isNaN(year) || year < 1970) {
        //
        if ((now.month() + 1) >= 11 && month <= 2) {
          year = now.year() + 1;
        }
        else if ((now.month() + 1) <= 2 && month >= 11) {
          year = now.year() - 1;
        }
        else {
          year = now.year();
        }
      }

      return moment([year, month - 1, day]);
    }

    return null;
  };


}
