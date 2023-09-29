import { type Dependencies } from '../../core/dependencies';
import { InmemoryPyramidGateway } from '../../gateways/inmemory-pyramid-gateway';
import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { pyramid } from './pyramid';

const questionGateway = new StubQuestionGateway();
questionGateway.setQuestion({
  id: 'id1',
  label: "Qu'est-ce que le TDD ?",
  answers: {
    A: 'Une technique de développement',
    B: 'Une pratique de CSS',
    C: 'Un langage de programmation',
    D: 'Une pratique de gestion de projet',
  },
});

export const appDependencies: Dependencies = {
  questionGateway,
  pyramidGateway: new InmemoryPyramidGateway(pyramid),
};
