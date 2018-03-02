interface View {
  render: () => void;
}

export interface DomView extends View {
  element: HTMLElement;
  mount: () => void;
  unmount: () => void;
}

export interface Dimensions {
  width: number;
  height: number;
}

export default View;
