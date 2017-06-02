import _ from 'lodash';
import TemplateStrage from "template-strage";

export default class TemplateStrageArray extends TemplateStrage{

  constructor() {
    this.messages = {
      "出勤": "<@#1> おはようございます (#2)",
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
