import CommandAbstract from './command-abstract';

export default class CommandHelp extends CommandAbstract{
  static match(body) {
    return body.match(/help/);
  }
  execute(username, date, time) {
    this.slack.send(
`
timesheetsの使い方：

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
(例: 集計 :n.rashidov 2017/4)
`
    );

  }
}
