import { PyramidGatewayStub } from '../gateways/pyramid-gateway-stub';
import { type Dependencies } from './dependencies';

export const testDefaultDependencies: Dependencies = {
  pyramidGateway: new PyramidGatewayStub(),
};
