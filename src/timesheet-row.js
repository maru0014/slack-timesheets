import _ from 'lodash';
import moment from 'moment';

export default class TimesheetRow {

  /**
   *
   * @param username {String}
   * @param date {Moment}
   * @param row
   */
  constructor(username, date, row) {
    this.username = username;
    this.row = row? row: ["","","","","","",""];
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
   * @param restTime {int}
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
   * @param workedHours {int}
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
   * @param totalWorkedHoursInMonth {int}
   * @returns {TimesheetRow}
   */
  setTotalWorkedHoursInMonth(totalWorkedHoursInMonth) {
    this.row[6] = totalWorkedHoursInMonth;
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

  workedHours(start, end, restedHours) {
    var workedHours = moment(end, "HH:mm").diff(moment(start, "HH:mm"), 'hours', true);
    workedHours = msToHours(workedHours);
    return this.rounder(workedHours - restedHours);
  }

}
