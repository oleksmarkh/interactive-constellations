import {DomView} from 'src/lib/types/View';

interface ExtendedWindow extends Window {
  worldView: DomView;
}

export default ExtendedWindow;
