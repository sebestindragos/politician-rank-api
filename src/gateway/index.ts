import {ApiGateway} from './gateway';
export {ApiGateway} from './gateway';

import {ServiceRegistry} from '../application/serviceRegistry';

export function get (
  apiVersion: string,
  registry: ServiceRegistry
): ApiGateway {
  let gateway = new ApiGateway(
    apiVersion, registry
  );

  return gateway;
}
