import _ from 'lodash';
import TemplateStrage from "./template-strage";

export default class TemplateStrageArray extends TemplateStrage {

  constructor() {
    super();
    this.messages = {
      label: "text"
    }
  }

  getLabels() {
    return _.keys(this.messages)
  }

  // generate message from template
  get(label) {
    return this.messages[label];
  }
}
