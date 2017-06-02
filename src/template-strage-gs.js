import _ from 'lodash';
import TemplateStrage from "template-strage";

export default class TemplateStrageGs extends TemplateStrage{

  constructor(spreadsheet) {
    // メッセージテンプレート設定
    this.sheet = spreadsheet.getSheetByName('_メッセージ');
    if(!this.sheet) {
      this.sheet = this.createMessageSheet(spreadsheet);
    }
  }

  static createMessageSheet(spreadsheet) {
    const sheet = spreadsheet.insertSheet('_メッセージ');
    if(!sheet) {
      throw "エラー: メッセージシートを作れませんでした";
    }

    sheet.getRange("A1:O2").setValues([
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
        "なかぬけ",
        "合計時間"
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
        "<@#1> #2は#3時間の休憩(中抜け)を登録しました",
        "<@#1> さんの#2は勤務は#3～#4就業時間#5時間(休憩#6時間)です"
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
