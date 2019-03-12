export type IMProviderType = "mind" | "topic" | "data";
export class BaseProvider {
  // this [name] attr will be this provider's unique identity,specially in data provider.
  public typeId: string; // = 'unique provider name'
  // this [type] attr will decide what kind of component can use this provider.
  public providerType: IMProviderType; //= 'providerType'
  // display-name only be used for choice of user selection.
  public displayName: string; //= 'Provider Name to Display'
  constructor(providerType: IMProviderType, typeId: string, displayName?: string) {
    this.providerType = providerType;
    this.typeId = typeId;
    this.displayName = displayName || typeId;
  }
}
export default BaseProvider;
