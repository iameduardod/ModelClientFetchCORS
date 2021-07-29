/* https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/DEVELOPMENT.md */
/* https://github.com/adobe/aem-sample-we-retail-journal/issues/80 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ModelClient,
  Model,
  AuthoringUtils,
} from '@adobe/aem-spa-page-model-manager';

export class CustomModelClient extends ModelClient {
  private _apiRootContentPath: string | null;
  private _apiHostBasicAuth: string | null;

  constructor(
    apiHost: string,
    apiRootContentPath: string,
    apiHostBasicAuth: string
  ) {
    super(apiHost);
    this._apiRootContentPath = apiRootContentPath || null;
    this._apiHostBasicAuth = apiHostBasicAuth || null;
  }

  /**
   * Returns content path of the API.
   * @returns API content path or `null`.
   */
  get apiRootContentPath(): string | null {
    return this._apiRootContentPath;
  }

  /**
   * Returns Base64 encoded Username:Password for API host.
   * @returns API host Base64 encoded Username:Password or `null`.
   */
  get apiHostBasicAuth(): string | null {
    return this._apiHostBasicAuth;
  }

  public fetch<M extends Model>(modelPath: string): Promise<M> {
    const FETCH_CONFIG = {
      headers: {
        Authorization: `Basic ${this.apiHostBasicAuth}`,
      },
    };

    if (!modelPath) {
      const err = `Fetching model rejected for path: ${modelPath}`;

      return Promise.reject(new Error(err));
    }

    // Either the API host has been provided or we make an absolute request relative to the current host
    let url = '';

    if (CustomModelClient.isSPAinAEM()) {
      url = `${super.apiHost}${modelPath}`;
    } else {
      url = `${super.apiHost}${this.apiRootContentPath}${modelPath}`;
    }

    // Assure that the default credentials value ('same-origin') is set for browsers which do not set it
    // or which are setting the old default value ('omit')
    return fetch(url, FETCH_CONFIG)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json() as Promise<M>;
        }

        throw { response };
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  public static getModelClientPath(
    apiRootContentPath: string,
    apiRootModelJsonPath: string
  ): string {
    if (CustomModelClient.isSPAinAEM()) {
      return `${apiRootContentPath}${apiRootModelJsonPath}`;
    }

    return apiRootModelJsonPath;
  }

  public static isSPAinAEM(): boolean {
    if (
      AuthoringUtils.isEditMode() ||
      AuthoringUtils.isInEditor() ||
      AuthoringUtils.isPreviewMode()
    ) {
      return true;
    }
    return false;
  }
}
