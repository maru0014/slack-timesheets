import _ from 'lodash';
import TemplateStrage from "./template-strage";

export default class TemplateStrageArray extends TemplateStrage{

  constructor() {
    super();
    this.messages = {
      "signIn":"<@#1> おはようございます (#2)",
      "signInUpdate":"<@#1> 出勤時間を#2へ変更しました",
      "signOut":"<@#1> お疲れ様でした (#2)",
      "signOutUpdate":"<@#1> 退勤時間を#2へ変更しました",
      "noRest":"<@#1> #2は休憩なしに変更しました",
      "signInFirst":"#1はまだ出勤押してません。このコマンドを出勤してから実行してください",
      "signOutFirst":"#1はまだ退勤押してません。このコマンドを退勤してから実行してください",
      "alreadySignedIn":"#1はもう出勤してますよ",
      "alreadySignedOut":"#1はもう退勤してますよ",
      "restHours":"<@#1> #2は#3時間の休憩(中抜け)を登録しました",
      "dayTotal":"<@#1> さんの#2の勤務は#3～#4就業時間#5時間、休憩#6時間、時間外労働#7時間、深夜労働#8時間です",
      "monthTotal":`#1さんの#2月集計:
就業 - #3時間
時間外労働 - #4時間
深夜労働 - #5時間`,
      "didnotWorkThatMonth":"#1さんが#2に出勤しませんでした",
      "didnotSignOutOn":"#1さんが#2に退勤しませんでした",
      "help":`timesheetsの使い方：

おはようございます 〜 今の時間で出勤登録

おはようございます 10:00 〜 10時に出勤登録

5/4は11:30に出勤しました 〜 5月4日の出勤時間を11:30で登録

お疲れ様でした 〜 今の時間で退勤登録

5/4は18:30に退勤しました 〜 5月4日の退勤時間を18:30で登録

◯は△時間なかぬけでした 〜 ◯の休憩△時間追加

今日は休憩なしでした 〜 今日の休憩を0時間に更新。注意：このコマンド打たないと休憩1時間を登録させます

今日は休憩1.5時間 〜 今日の休憩を1.5時間に更新。

◯は何時間働きましたか 〜 ◯に働いた時間と休憩時間を表示

集計 :username year/month 〜 usernameのユーザーのyear年month月に働いた就業時間を表
(例: 集計 :n.rashidov 2017/4)`
    }
  }


  getLabels() {
    return _.keys(this.messages)
  }

  // テンプレートからメッセージを生成
  get(label) {

    return this.messages[label];
  }

}
