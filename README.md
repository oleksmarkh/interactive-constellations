# interactive-constellations

  [![license][license-image]][license-url]

A WebGL experiment aimed to create an interactive visualization of gravitating particles.

The goal is to have an embeddable widget, providing external interfaces, e.g. as a React component.

## Tech stack

- [x] [three.js](https://threejs.org/docs/)
- [ ] [d3-scale](https://github.com/d3/d3-scale)
- [x] [jest](https://facebook.github.io/jest)

## Setup

### Install dependencies

```bash
$ yarn install
```

### Run a local dev server

```bash
$ yarn run:dev
```

### Run unit tests

```bash
$ yarn test
```

### Build and deploy to GitHub pages

```bash
$ yarn build:prod
$ yarn deploy
```

[license-image]: https://img.shields.io/github/license/oleksmarkh/interactive-constellations.svg?style=flat-square
[license-url]: https://github.com/oleksmarkh/interactive-constellations/blob/master/LICENSE
