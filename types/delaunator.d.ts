declare module 'delaunator' {
  export default class Delaunator {
    coords: Float64Array;
    triangles: Uint32Array;
    halfedges: Int32Array;
    hull: Uint32Array;

    static from(
      points: ArrayLike<number> | ArrayLike<ArrayLike<number>>,
      getX?: (point: unknown) => number,
      getY?: (point: unknown) => number,
    ): Delaunator;

    constructor(coords: ArrayLike<number>);
  }
}
