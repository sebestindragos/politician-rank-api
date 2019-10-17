import { IService } from "./IService";

/**
 * Class managing instantiated services.
 */
export class ServiceRegistry {
  private _runningServices: Map<string, IService> = new Map();

  /**
   * Class constructor.
   */
  constructor() {}

  /**
   * Register a new service
   */
  add(service: IService) {
    this._runningServices.set(service.name, service);
  }

  /**
   * Get a service instance.
   */
  getInstance(name: string): IService {
    let service = this._runningServices.get(name);
    if (!service) {
      throw new Error(`No service named ${name} found in registry.`);
    }

    return service;
  }
}
