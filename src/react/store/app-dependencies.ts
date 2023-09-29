import { type Dependencies } from '../../core/dependencies';
import { InmemoryPyramidGateway } from '../../gateways/inmemory-pyramid-gateway';
import { pyramid } from './pyramid';

export const appDependencies: Dependencies = {
  pyramidGateway: new InmemoryPyramidGateway(pyramid),
};
