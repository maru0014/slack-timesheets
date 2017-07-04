import _ from 'lodash';
import moment from 'moment';

export default class GSConfigure {
  constructor(spreadsheet) {
    const SHEET_NAME = '_Settings';
    this.sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!this.sheet) {
      this.sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
  };

  get(key, defaultValue) {
    if (this.sheet.getLastRow() < 1) {
      return defaultValue;
    }

    const values = _.find(this.sheet.getRange("A1:B" + this.sheet.getLastRow()).getValues(), function (v) {
      return v[0] == key;
    });
    if (values) {
      if (_.isDate(values[1])) {
        return moment(values[1]);
      } else {
        return String(values[1]);
      }
    } else {
      return defaultValue;
    }
  };

  set(key, val) {
    if (this.sheet.getLastRow() > 0) {
      const vals = this.sheet.getRange("A1:A" + this.sheet.getLastRow()).getValues();
      for (let i = 0; i < this.sheet.getLastRow(); ++i) {
        if (vals[i][0] == key) {
          this.sheet.getRange("B" + (i + 1)).setValue(String(val));
          return val;
        }
      }
    }
    this.sheet.getRange("A" + (this.sheet.getLastRow() + 1) + ":B" + (this.sheet.getLastRow() + 1)).setValues([[key, val]]);
    return val;
  };

  setNote(key, note) {
    if (this.sheet.getLastRow() > 0) {
      const vals = this.sheet.getRange("A1:A" + this.sheet.getLastRow()).getValues();
      for (let i = 0; i < this.sheet.getLastRow(); ++i) {
        if (vals[i][0] == key) {
          this.sheet.getRange("C" + (i + 1)).setValue(note);
          return;
        }
      }
    }
    this.sheet.getRange("A" + (this.sheet.getLastRow() + 1) + ":C" + (this.sheet.getLastRow() + 1)).setValues([[key, '', note]]);
    return;
  };
};
