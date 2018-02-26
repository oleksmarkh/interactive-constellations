import * as StatsWidget from 'stats.js';

import {DomView} from 'src/lib/types/View';

class Stats implements DomView {
  private statsWidget: StatsWidget;

  constructor(
    public element: HTMLElement,
  ) {
    this.statsWidget = new StatsWidget();
  }

  public mount() {
    this.element.appendChild(this.statsWidget.dom);
  }

  public unmount() {
    this.element.removeChild(this.statsWidget.dom);
  }

  public render() {
    this.statsWidget.update();
  }
}

export default Stats;
