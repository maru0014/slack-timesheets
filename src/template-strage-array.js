import _ from 'lodash';
import TemplateStrage from "./template-strage";

export default class TemplateStrageArray extends TemplateStrage{

  constructor() {
    super();
    this.messages = {
      "出勤":"<@#1> おはようございます (#2)",
      "出勤更新":"<@#1> 出勤時間を#2へ変更しました",
      "退勤":"<@#1> お疲れ様でした (#2)",
      "退勤更新":"<@#1> 退勤時間を#2へ変更しました",
      "休暇":"<@#1> #2を休暇として登録しました",
      "休暇取消":"<@#1> #2の休暇を取り消しました",
      "出勤中":"#1が出勤しています",
      "出勤なし":"全員退勤しています",
      "休暇中":"#1は#2が休暇です",
      "休暇なし":"#1に休暇の人はいません",
      "出勤確認":"今日は休暇ですか？ #1",
      "退勤確認":"退勤しましたか？ #1",
      "休憩なし":"<@#1> #2は休憩なしに変更しました",
      "なかぬけ":"<@#1> #2は#3時間の休憩(中抜け)を登録しました",
      "合計時間":"<@#1> さんの#2は勤務は#3～#4就業時間#5時間(休憩#6時間)です",
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
