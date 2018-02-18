import {Math as ThreeMath} from 'three';

export function random(low: number = -0.5, high: number = 0.5): number {
  return ThreeMath.randFloat(low, high);
}

export function average(...elements: number[]): number {
  return elements.reduce((sum, value) => sum + value, 0) / elements.length;
}

export function median(...elements: number[]): number {
  const indexOfMin = elements.indexOf(Math.min(...elements));
  const indexOfMax = elements.indexOf(Math.max(...elements));
  const noMinMax = elements.filter((_, index) => index !== indexOfMin && index !== indexOfMax);

  return average(...noMinMax);
}
