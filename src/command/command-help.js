import CommandAbstract from './command-abstract';

export default class CommandHelp extends CommandAbstract{
  static match(body) {
    return body.match(/help/);
  }
  execute(username, date, time) {

    this.slack.send(this.template.render(
      "help"
    ));

  }
}
