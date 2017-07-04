export default class GASProperties {
  /**
   * @param properties
   */
  constructor(properties = PropertiesService.getScriptProperties()) {
    this.properties = properties;
  }

  get(key) {
    return this.properties.getProperty(key);
  }

  set(key, val) {
    this.properties.setProperty(key, val);
    return val;
  };
}
