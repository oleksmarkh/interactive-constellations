// @see: https://threejs.org/docs/index.html#examples/renderers/CanvasRenderer
export function detectWebglSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');

    return Boolean(
      (window as any).WebGLRenderingContext &&
      (
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      ),
    );
  } catch (e) {
    return false;
  }
}
