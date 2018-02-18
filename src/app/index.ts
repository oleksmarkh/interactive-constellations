import {detectWebglSupport} from 'src/app/utils';
import render from 'src/lib';

if (!detectWebglSupport()) {
  console.warn('WebGL is not supported');
} else {
  render(document.getElementById('container'));
}
