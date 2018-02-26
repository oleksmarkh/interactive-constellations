import ExtendedWindow from 'src/lib/types/ExtendedWindow';
import config from 'src/lib/config';
import World, {WorldView} from 'src/lib/classes/World';

function render(element: HTMLElement) {
  const world = new World();
  const worldView = new WorldView(element, config, world);

  worldView.mount();
  worldView.run();

  if (config.debug.expose) {
    (window as ExtendedWindow).worldView = worldView;
    console.log(worldView);
    console.log(worldView.config);
  }
}

export default render;
