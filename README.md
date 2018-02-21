# interactive-constellations

  [![license][license-image]][license-url]
  ![code size][code-size-image]

A WebGL experiment aimed to create an interactive visualization of gravitating particles.

The goal is to have an embeddable widget, providing external interfaces, e.g. as a React component.

## Tech stack

dev deps:
[`typescript`](https://www.typescriptlang.org/docs),
[`webpack`](https://webpack.js.org/api),
[`jest`](https://facebook.github.io/jest).

deps:
[`three`](https://threejs.org/docs),
[`d3-scale`](https://github.com/d3/d3-scale).

## Setup

```bash
$ yarn install     # install deps
$ yarn run:dev     # run a local dev server
$ yarn test        # run unit tests
$ yarn build:prod  # produce a build artifact
$ yarn deploy      # deploy to GitHub pages
```

[license-image]: https://img.shields.io/github/license/oleksmarkh/interactive-constellations.svg?style=flat-square
[license-url]: https://github.com/oleksmarkh/interactive-constellations/blob/master/LICENSE
[code-size-image]: https://img.shields.io/github/languages/code-size/oleksmarkh/interactive-constellations.svg?style=flat-square
