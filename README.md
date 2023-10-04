# Qui veut gagner des millions - Projet de formation TDD et Clean Architecture

Version personnelle du projet de la formation TDD et Clean Architecture dans le monde Web avec React/Typescript/Redux des 11 et 12 septembre 2023 dispensée par Michaël Azerhad de WealCome. Dépôt du projet d'origine: [https://github.com/mica16/tdd-cleanarchi-web-11-septembre-2023/](https://github.com/mica16/tdd-cleanarchi-web-11-septembre-2023/).

## Consignes du projet

User Story : En tant que candidat de Qui veut gagner des millions, je dois répondre à un pool de questions de sorte à gagner de l'argent.

- Les questions sont récupérées et affichées de façon aléatoire à l’écran.
- Une fois la réponse du candidat donnée, la bonne réponse s’affiche en vert et la mauvaise, si saisie, s’affiche en orange.
- À chaque réponse on fait évoluer la pyramide de gains : 0€, 800€, 1500€ (palier), 3000€, …
- Le joker 50/50 est utilisable une seule fois.
- Une mauvaise réponse fait redescendre au palier précédent si existant, ou bien à 0€.
- Quand le compte à rebours atteint zéro, cela équivaut à une réponse incorrecte.
- Technologies : Typescript / Redux / React / Jest
- Les disciplines TDD et Clean Architecture devront être respectées.
- Un squelette d'UI est proposé sur la base technique React / Vite / TailwindCSS.

## Cette version

### Motivations

- Appliquer en partant de zéro la démarche TDD et Clean Architecture vue en formation.
- Mieux comprendre Redux et les best practices recommandées par la documentation.

### Stack technique

- Vite
- React
- Typescript
- Redux
- Vitest
- React Testing Library
