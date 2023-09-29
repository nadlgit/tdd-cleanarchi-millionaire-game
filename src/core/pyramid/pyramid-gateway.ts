import { type Pyramid } from './pyramid';

export type PyramidGateway = {
  load(): Promise<Pyramid>;
};
