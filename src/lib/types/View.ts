interface View {
  render: () => void;
}

export interface DomView extends View {
  element: HTMLElement;
  mount: () => void;
  unmount: () => void;
}

export default View;
