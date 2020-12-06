import paper from "paper/dist/paper-core";

export const point = (x: number, y: number) => new paper.Point(x, y);
export const size = (w: number, h: number) => new paper.Size(w, h);
export const colorString = (color: string) => new paper.Color(color);

export const makeRectangle = (x: number, y: number, w: number, h?: number) => {
  return new paper.Path.Rectangle(point(x, y), size(w, h || w));
};
