import {average, median} from '../math';

describe('math utils', () => {
  test('average()', () => {
    expect(average()).toEqual(NaN);

    expect(average(0)).toEqual(0);
    expect(average(2, 3)).toEqual(2.5);
    expect(average(1, 2, 13, 0)).toEqual(4);
  });

  test('median()', () => {
    expect(median()).toEqual(NaN);
    expect(median(0)).toEqual(NaN);

    expect(median(-1, 10, 5)).toEqual(5);
    expect(median(-10, -4, 2, 8, 100)).toEqual(2);
  });
});
