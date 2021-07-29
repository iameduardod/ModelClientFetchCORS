/* removed imports for brevity */

export class AppComponent {
  items: any;
  itemsOrder: any;
  path: any;
  apiHost = 'http://localhost:4502';
  apiRootContentPath = '/content/marketing';
  apiRootModelJsonPath = '/us/en.model.json';
  apiHostBasicAuth = btoa('username:password');

  modelClient: ModelClient = new CustomModelClient(
    this.apiHost,
    this.apiRootContentPath,
    this.apiHostBasicAuth
  );

  constructor() {
    super();
    ModelManager.initialize({
      path: CustomModelClient.getModelClientPath(
        this.apiRootContentPath,
        this.apiRootModelJsonPath
      ),
      modelClient: this.modelClient,
    }).then(this.updateData);
  }

  private updateData = (pageModel: any) => {
    this.path = pageModel[Constants.PATH_PROP];
    this.items = pageModel[Constants.ITEMS_PROP];
    this.itemsOrder = pageModel[Constants.ITEMS_ORDER_PROP];
  };
}
