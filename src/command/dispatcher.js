import DateTime from '../date-time';
import CommandHelp from './command-help';
import CommandSignIn from './command-sign-in';
import CommandSignOut from './command-sign-out';
import CommandTotal from "./command-total";
import CommandNoRest from "./command-no-rest";
import CommandRestHours from "./command-rest-hours";


export default class Dispatcher {

  constructor(kernel) {
    this.kernel = kernel;
  }

  dispatch(username, body) {
    const datetime = DateTime.parse(body);

    // コマンド集
    const commands = [
      // ['actionSignOut', /(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|退勤|ごきげんよ|グ[ッ]?バイ)/],
      // ['actionWhoIsOff', /(だれ|誰).*(休|やす(ま|み|む))/],
      // ['actionWhoIsIn', /(だれ|誰)/],
      // ['actionCancelOff', /(やす(ま|み|む)|休暇).*(キャンセル|消|止|やめ|ません)/],
      // ['actionOff', /(やす(ま|み|む)|休暇)/],
      // ['actionSignIn', /(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|出勤)/],
      // ['actionNoKyuukei', /(休憩なし)/],
      // ['actionNakanuke', /(なかぬけ)/],
      // ['actionMonthTotal', /(集計)/],
      // ['confirmSignIn', /__confirmSignIn__/],
      // ['confirmSignOut', /__confirmSignOut__/],
      // ['actionDayTotal', /(何時間働)/],
      CommandSignOut,
      CommandSignIn,
      CommandTotal,
      CommandNoRest,
      CommandRestHours,
      CommandHelp
    ];


    commands.map((CommandClass) => {
      if (CommandClass.match(body)) {
        const command = new CommandClass(this.kernel.getSlack(), this.kernel.getTemplate(), this.kernel.getTimesheets());
        command.execute(username, datetime.date, datetime.time, body);
      }
    });


  }
}
