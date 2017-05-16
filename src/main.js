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
        dispatcher.dispatch('takabayasho', 'おはよう');
    }
}




// 初期化する
global.setUp = () => {
    const properties = new GASProperties();

    if (!properties.get('spreadsheet')) {
        const installer = new Installer();
        installer.install(properties);

        //     // 毎日11時頃に出勤してるかチェックする
        //     ScriptApp.newTrigger('confirmSignIn')
        //         .timeBased()
        //         .everyDays(1)
        //         .atHour(11)
        //         .create();
        //
        //     // 毎日22時頃に退勤してるかチェックする
        //     ScriptApp.newTrigger('confirmSignOut')
        //         .timeBased()
        //         .everyDays(1)
        //         .atHour(22)
        //         .create();
    }

};



const init = () => {
    // initLibraries();
    //
    // var global_settings = new GASProperties();
    //
    // var spreadsheetId = global_settings.get('spreadsheet');
    // if(spreadsheetId) {
    //     var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    //     var settings = new GSProperties(spreadsheet);
    //     var template = new GSTemplate(spreadsheet);
    //     var slack = new Slack(settings.get('Slack Incoming URL'), template, settings);
    //     var storage = new GSTimesheets(spreadsheet, settings);
    //     var timesheets = new Timesheets(storage, settings, slack);
    //     return({
    //         receiver: slack,
    //         timesheets: timesheets,
    //         storage: storage
    //     });
    // }
    return null;
}

//
// // Time-based triggerで実行
// function confirmSignIn() {
//     var miyamoto = init();
//     miyamoto.timesheets.confirmSignIn();
// }
//
// // Time-based triggerで実行
// function confirmSignOut() {
//     var miyamoto = init();
//     miyamoto.timesheets.confirmSignOut();
// }
//
// /* バージョンアップ処理を行う */
// function migrate() {
//     // if(typeof GASProperties === 'undefined') GASProperties = loadGASProperties();
//     //
//     // var global_settings = new GASProperties();
//     // global_settings.set('version', "::VERSION::");
//     console.log("バージョンアップが完了しました。");
// }

