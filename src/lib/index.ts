import World from 'src/lib/classes/World';

function render(element: HTMLElement) {
  const world = new World(element);

  world.initialize();
  world.run();
}

export default render;
