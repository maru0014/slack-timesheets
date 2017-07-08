import CommandAbstract from './command-abstract';

export default class CommandHelp extends CommandAbstract {
  static match(body, i18n) {
    const regex = new RegExp(i18n.__('commands.help'), 'i');
    return body.match(regex);
  }

  execute(username, date, time) {
    this.slack.send(this.template.render(
      "help"
    ));
  }
}
