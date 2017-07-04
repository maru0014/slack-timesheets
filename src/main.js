import GASProperties from './gas-properties';
import Kernel from './kernel';
import Installer from './installer';
import CommandDispatcher from './command/dispatcher';

global.main = () => {
  Logger.log('hoge');
};

// Messages incoming from Slack Outgoing
global.doPost = (e) => {
  const kernel = new Kernel();
  if (kernel.boot()) {
    kernel.getSlack().receiveMessage(e.parameters, (username, body) => {
      const dispatcher = new CommandDispatcher(kernel);
      dispatcher.dispatch(username, body);
    });
  }
};

// test option for debugging in GAS
global.test = () => {
  const kernel = new Kernel();
  if (kernel.boot()) {
    const dispatcher = new CommandDispatcher(kernel);
    dispatcher.dispatch('nodir-xearts', 'Sign in 10am'); // replace nodir-xearts with your username
  }
};

// Initialize
global.setUp = () => {
  const properties = new GASProperties();

  if (!properties.get('spreadsheet')) {
    const installer = new Installer();
    installer.install(properties);
  }

};

const init = () => {
  return null;
};