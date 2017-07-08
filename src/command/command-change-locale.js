import CommandAbstract from './command-abstract';

export default class CommandChangeLocale extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp('change locale to', 'i');
    return body.match(regex);
  }

  execute(username, date, time, body, i18n, config) {
    const reg = new RegExp('change locale to\\s*([^\\n\\r]*)', 'i');
    const matches = body.match(reg);
    const newLocale = matches[1];
    if (this.template.localeExists(newLocale)) {
      config.set('Language', newLocale);
      this.slack.send(this.template.render(
        "changeLocale",

        username,
        newLocale
      ));
    }
    else {
      this.slack.send(this.template.render(
        "changeLocaleFailed",

        username,
        newLocale
      ));
    }
  }
}
