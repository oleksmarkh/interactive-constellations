import World, {WorldView} from 'src/lib/classes/World';

function render(element: HTMLElement) {
  const world = new World();
  const worldView = new WorldView(element, world);

  worldView.mount();
  worldView.render();
}

export default render;
