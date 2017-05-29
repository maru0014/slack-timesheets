import _ from 'lodash';
import moment from 'moment';
import GSTimesheets from './gs-timesheets'

export default class TimesheetRow {

  /**
   *
   * @param username {String}
   * @param date {Moment}
   * @param row
   */
  constructor(username, date, row) {
    this.username = username;
    this.row = row? row: ["","","","","","","","",""];
    this.setDate(date);
    if (!row) {
      this.setRestTime(1);
    }
  }

  getRow() {
    return this.row;
  }

  /**
   * @returns {String}
   */
  getUsername() {
    return this.username;
  }

  /**
   * @returns {Moment}
   */
  getDate() {
    return this.date;
  }

  /**
   *
   * @param date {Moment}
   * @returns {TimesheetRow}
   */
  setDate(date) {
    this.date = date;
    this.row[0] = date.toDate();
    return this;
  }

  /**
   *
   * @returns {*}
   */
  getSignIn() {
    return this.row[1];
  }

  /**
   *
   * @param signIn
   * @returns {TimesheetRow}
   */
  setSignIn(signIn) {
    this.row[1] = signIn;
    this.calculate();
    return this;
  }


  getSignOut() {
    return this.row[2];
  }

  /**
   *
   * @param signOut
   * @returns {TimesheetRow}
   */
  setSignOut(signOut) {
    this.row[2] = signOut;
    this.calculate();
    return this;
  }

  getNote() {
    return this.row[3];
  }

  /**
   *
   * @param note {String}
   * @returns {TimesheetRow}
   */
  setNote(note) {
    this.row[3] = note;
    return this;
  }

  getRestTime() {
    return this.row[4];
  }

  /**
   *
   * @param restTime
   * @returns {TimesheetRow}
   */
  setRestTime(restTime) {
    this.row[4] = restTime;
    this.calculate();
    return this;
  }

  getWorkedHours() {
    return this.row[5];
  }

  /**
   *
   * @param workedHours
   * @returns {TimesheetRow}
   */
  setWorkedHours(workedHours) {
    this.row[5] = workedHours;
    return this;
  }

  getTotalWorkedHoursInMonth() {
    return this.row[6];
  }

  /**
   *
   * @param totalWorkedHoursInMonth
   * @returns {TimesheetRow}
   */
  setTotalWorkedHoursInMonth(totalWorkedHoursInMonth) {
    this.row[6] = totalWorkedHoursInMonth;
    return this;
  }

  getOvertimeHours() {
    return this.row[7];
  }

  /**
   *
   * @param overtimeHours
   * @returns {TimesheetRow}
   */
  setOvertimeHours(overtimeHours) {
    this.row[7] = overtimeHours;
    return this;
  }

  getLateHours() {
    return this.row[8];
  }

  /**
   *
   * @param lateHours
   * @returns {TimesheetRow}
   */
  setLateHours(lateHours) {
    this.row[8] = lateHours;
    return this;
  }



  // ToDo: 超過勤務時間と深夜時間



  calculate() {
    const signIn = this.getSignIn();
    const signOut = this.getSignOut();
    const restTime = this.getRestTime();

    if (!signIn || signIn === '-' || !signOut || signOut === '-') {
      return;
    }

    // ToDo:いろいろ計算する


  }

  static rounder(num) {
    var intPart = Math.floor(num);

    var decimalPart = num - intPart;
    if (decimalPart >= 0.75) {
      return intPart+".75";
    }
    else if (decimalPart >= 0.5) {
      return intPart+".5";
    }
    else if (decimalPart >= 0.25) {
      return intPart+".25";
    }
    else {
      return intPart;
    }
  }

  static workedHours(start, end, restedHours) {
    let workedHours = moment(end).diff(moment(start), 'hours', true);
    return TimesheetRow.rounder(workedHours - restedHours);
  }

  static overtimeHours(workedHours) {
    if (workedHours > 8) return TimesheetRow.rounder(workedHours - 8);
  }

  static lateHours(originalDatetime, currentDatetime) {
    //taking two parameters here, in case the user works eg. from 24 May 9pm to 25 May 7am -- need an original date (24 May)]
    let lateHourStart = 22;
    if (moment(currentDatetime).hour() >= lateHourStart) {
      let original = moment(originalDatetime).format("YYYY/MM/DD")+' '+lateHourStart+":00";
      let current = moment(currentDatetime).format("YYYY/MM/DD HH:mm");

      let lateHours = moment(current).diff(moment(original), 'hours', true);
      return TimesheetRow.rounder(lateHours);
    }
  }

  static getMonthTotal(user, year, month) {
    let matomeSheet = GSTimesheets._getSheet(user);
    let lastRow = matomeSheet.getLastRow();
    let matomeRange = "B5:B" + lastRow;
    let matomeData = matomeSheet.getRange(matomeRange).getValues();
    let firstDay = null;
    let lastDay = 0;

    let actualMonth = month+1;
    let helperStringInit = user+"さんが"+year+"年"+actualMonth+"月には";
    let helperStringFin = "時間働きました";

    for (let i = 0; i < matomeData.length; i++) {
      if (matomeData[i][0]){
        if (matomeData[i][0].getMonth() == month && matomeData[i][0].getYear() == year) {
          firstDay = i + 5;
          break;
        }
      }
    }
    for (let j = matomeData.length-1; j >= 0; j--) {
      if (matomeData[j][0]) {
        if (matomeData[j][0].getMonth() == month && matomeData[j][0].getYear() == year) {
          lastDay = j + 5;
          break;
        }
      }
    }

    if (firstDay != null && lastDay != null) {
      var hoursData = 0;
      for (let n = firstDay; n <= lastDay; n++) {
        if (matomeSheet.getRange("F"+n).getValue()) {
          hoursData += parseFloat(matomeSheet.getRange("F"+n).getValue());
        }
      }
      return helperStringInit+hoursData+helperStringFin;
    }
    else {
      return helperStringInit+"出勤しませんでした";
    }
  }

}
