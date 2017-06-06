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


    static parse(str) {
        let date = DateTime.parseDate(str);
        let time = DateTime.parseTime(str);

        // 日付またいだときとかどうする。。。


        return new DateTime(date, time);
    }

    // テキストから時間を抽出
    static parseTime (str) {
        str = String(str || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });

        const reg = /((\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|)|(am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|)|(\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm)|(\d{1,2})\s*時)/;
        const matches = str.match(reg);
        if(matches) {
            let hour, min;

            // 1時20, 2:30, 3:00pm
            if(matches[2] != null) {
                hour = parseInt(matches[2]);
                min = parseInt(matches[3] ? matches[3] : '0');
                if(_.includes(['pm'], matches[4])) {
                    hour += 12;
                }
            }

            // 午後1 午後2時30 pm3
            if(matches[5] != null) {
                hour = parseInt(matches[6]);
                min = parseInt(matches[8] ? matches[8] : '0');
                if(_.includes(['pm', '午後'], matches[5])) {
                    hour += 12;
                }
            }

            // 1am 2:30pm
            if(matches[9] != null) {
                hour = parseInt(matches[9]);
                min = parseInt(matches[11] ? matches[11] : '0');
                if(_.includes(['pm'], matches[12])) {
                    hour += 12;
                }
            }

            // 14時
            if(matches[13] != null) {
                hour = parseInt(matches[13]);
                min = 0;
            }



            return moment({hour: hour, minute: min});
        }
        return null;
    };

    // テキストから日付を抽出
    static parseDate (str) {
        str = String(str || "").toLowerCase().replace(/[Ａ-Ｚａ-ｚ０-９：／．]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });

        if(str.match(/(明日|tomorrow)/)) {
            return moment().add('days', 1).startOf('day');
        }

        if(str.match(/(今日|today)/)) {
            return moment().startOf('day');
        }

        if(str.match(/(昨日|yesterday)/)) {
            return moment().add('days', -1).startOf('day');
        }

        const reg = /((\d{4})[-\/年]{1}|)(\d{1,2})[-\/月]{1}(\d{1,2})/;
        const matches = str.match(reg);
        if(matches) {
            let year = parseInt(matches[2]);
            let month = parseInt(matches[3]);
            let day = parseInt(matches[4]);
            const now = moment();
            if(_.isNaN(year) || year < 1970) {
                //
                if((now.month() + 1) >= 11 && month <= 2) {
                    year = now.year() + 1;
                }
                else if((now.month() + 1) <= 2 && month >= 11) {
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
