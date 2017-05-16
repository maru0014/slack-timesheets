export default class CommandAbstract {
  /**
   *
   * @param slack {Slack}
   * @param template {GSTemplate}
   * @param timesheets {GSTimesheets}
   */
  constructor(slack, template, timesheets) {
    this.slack = slack;
    this.template = template;
    this.timesheets = timesheets;
  }

  /**
   *
   * @param body {String}
   * @returns {boolean}
   */
  static match(body) {
    return false;
  }

  /**
   *
   * @param username {String}
   * @param date {Moment|null}
   * @param time {Moment|null}
   */
  execute(username, date, time) {

  }
}
