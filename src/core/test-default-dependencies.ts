import { StubPyramidGateway } from '../gateways/stub-pyramid-gateway';
import { type Dependencies } from './dependencies';

export const testDefaultDependencies: Dependencies = {
  pyramidGateway: new StubPyramidGateway(),
};
