import { BaseProvider } from "../.base";
export class DataProvider extends BaseProvider {
  constructor(typeId: string, displayName: string) {
    super("data", typeId, displayName);
  }
  parse(data: any, type: string) {}
  export(data: IMMindData): any {}
  saveAs(name: string, content: string, type: string) {}
  readAs(file: File, type: string): IMMindData {
    return new Map();
  }
}
