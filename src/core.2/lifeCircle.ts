import { destroyObject } from "utils/tools";
import TSMind from "core.2";

export class BSVNodeLifeCircle {
  public type: string;
  public mind: TSMind;
  // state flags
  public _mounted: boolean = false;
  public _destroyed: boolean = false;
  constructor(mind: TSMind) {
    this.mind = mind;
  }
  beforeCreate() {}
  created() {}
  mounted() {}
  beforeDestroy() {}
  updated() {}
  beforeUpdate() {}
  // life hooks
  public readonly $beforeDestroy = () => {
    if (this._destroyed) return;
    this.mind.$trigger(`beforeDestroy.${this.type}`, this);
    this.beforeDestroy();
    destroyObject(this);
    // set destroyed flag
    this._destroyed = true;
  };
  public readonly $beforeUpdate = () => {
    this.mind.$trigger(`beforeUpdate.${this.type}`, this);
    this.beforeUpdate();
  };
  public readonly $updated = () => {
    this.mind.$trigger(`updated.${this.type}`, this);
    this.updated();
  };
  public readonly $beforeCreate = () => {
    this.mind.$trigger(`beforeCreate.${this.type}`, this);
    this.beforeCreate();
  };
  public readonly $created = () => {
    this.mind.$trigger(`created.${this.type}`, this);
    this.created();
  };
  public readonly $mounted = () => {
    this.mind.$trigger(`mounted.${this.type}`, this);
    this._mounted = true;
    this.mounted();
  };
}
