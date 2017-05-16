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

お疲れ様でした 〜 今の時間で退勤登録

◯は△時間なかぬけでした 〜 ◯の休憩△時間追加

◯は休憩なしでした 〜 ◯の休憩を0時間に更新。注意：このコマンド打たないと休憩1時間を登録させます

◯は△時に出勤しました 〜 ◯日付△時間に出勤登録

◯は△時に退勤しました 〜 ◯日付△時間に退勤登録

◯はやすみです 〜 ◯日付の列に'ー'付ける

◯はやすみキャンセル 〜 ◯日付の列から'ー'を削除

誰が出勤してますか 〜 出勤中のユーザーを表示

誰がやすみ 〜 休みのユーザーを表示

◯は何時間働きましたか 〜 ◯に働いた時間と休憩時間を表示

集計 :username year/month 〜 usernameのユーザーのyear年month月に働いた就業時間を表
(例: 集計 :n.rashidov 2017/4)
`
    );

  }
}
