import {debounce} from 'lodash';

export function debounceLeading(fn: () => void, wait: number) {
  return debounce(fn, wait, {
    leading: true,
    trailing: false,
  });
}

export function debounceTrailing(fn: () => void, wait: number) {
  return debounce(fn, wait, {
    leading: false,
    trailing: true,
  });
}
