import _ from 'lodash';
import TemplateStrage from './template-strage';

export default class TemplateStrageGs extends TemplateStrage{

  constructor(spreadsheet) {
    // メッセージテンプレート設定
    this.sheet = spreadsheet.getSheetByName('_メッセージ');
    if(!this.sheet) {
      this.sheet = TemplateStrageGs.createMessageSheet(spreadsheet);
    }
  }

  static createMessageSheet(spreadsheet) {
    const sheet = spreadsheet.insertSheet('_メッセージ');
    if(!sheet) {
      throw "エラー: メッセージシートを作れませんでした";
    }

    sheet.getRange("A1:2").setValues([
      [
        "出勤",
        "出勤更新",
        "退勤",
        "退勤更新",
        "休暇",
        "休暇取消",
        "出勤中",
        "出勤なし",
        "休暇中",
        "休暇なし",
        "出勤確認",
        "退勤確認",
        "休憩なし",
        "signinFirst",
        "signoutFirst",
        "didnotSignin",
        "alreadySignedin",
        "alreadySignedout",
        "なかぬけ",
        "合計時間",
        "monthlyTotal",
        "didnotWorkThatMonth",
        "didnotSignoutOn",
        "help"
      ],
      [
        "<@#1> おはようございます (#2)",
        "<@#1> 出勤時間を#2へ変更しました",
        "<@#1> お疲れ様でした (#2)",
        "<@#1> 退勤時間を#2へ変更しました",
        "<@#1> #2を休暇として登録しました",
        "<@#1> #2の休暇を取り消しました",
        "#1が出勤しています",
        "全員退勤しています",
        "#1は#2が休暇です",
        "#1に休暇の人はいません",
        "今日は休暇ですか？ #1",
        "退勤しましたか？ #1",
        "<@#1> #2は休憩なしに変更しました",
        "#1はまだ出勤押してません。このコマンドを出勤してから実行してください",
        "#1はまだ退勤押してません。このコマンドを退勤してから実行してください",
        "<@#1> #2は出勤してません",
        "#1はもう出勤してますよ",
        "#1はもう退勤してますよ",
        "<@#1> #2は#3時間の休憩(中抜け)を登録しました",
        "<@#1> さんの#2は勤務は#3～#4就業時間#5時間、休憩#6時間、時間外労働#7時間、深夜労働#8時間です",
        `#1さんの#2月集計:
就業 - #3時間
時間外労働 - #4時間
深夜労働 - #5時間`,
        "#1さんが#2に出勤しませんでした",
        "#1さんが#2に退勤してないです",
        `timesheetsの使い方：

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
      ]
    ]);

    return sheet;
  }

  getLabels() {
    return this.sheet.getRange("A1:Z1").getValues()[0];
  }

  // テンプレートからメッセージを生成
  get(label) {
    var labels = this.getLabels();

    for(var i = 0; i < labels.length; ++i) {
      if(labels[i] == label) {
        return _.sample(
            _.filter(
                _.map(this.sheet.getRange(String.fromCharCode(i+65)+'2:'+(String.fromCharCode(i+65))).getValues(), function(v) {
                  return v[0];
                }),
                function(v) {
                  return !!v;
                }
            )
        );
      }
    }
    return null;
  }

}
