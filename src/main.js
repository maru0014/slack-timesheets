import GASProperties from './gas-properties';
import Kernel from './kernel';
import Installer from './installer';
import CommandDispatcher from './command/dispatcher';


global.main = () => {
  Logger.log('hoge');
}

// SlackのOutgoingから来るメッセージ
global.doPost = (e) => {

    const kernel = new Kernel();
    if (kernel.boot()) {
        kernel.getSlack().receiveMessage(e.parameters, (username, body) => {
            const dispatcher = new CommandDispatcher(kernel);
            dispatcher.dispatch(username, body);
        });
    }
}


// SlackのOutgoingから来るメッセージ
global.test = () => {

    const kernel = new Kernel();
    if (kernel.boot()) {
        const dispatcher = new CommandDispatcher(kernel);
        dispatcher.dispatch('nodir-xearts', 'How many hours did I work today?');
    }
}




// 初期化する
global.setUp = () => {
    const properties = new GASProperties();

    if (!properties.get('spreadsheet')) {
        const installer = new Installer();
        installer.install(properties);
    }

};



const init = () => {
    return null;
}