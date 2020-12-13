import paper from "paper/dist/paper-core";
import { point } from "./abstractions";

export const halftoneFill = (item: paper.Item, densityDistance: number) => {
  const g = new paper.Group();

  const width = item.bounds.width;
  const height = item.bounds.height;

  const amtCols = Math.floor(width / densityDistance);
  const amtRows = Math.floor(height / densityDistance);

  for (let x = 0; x < amtCols; x++) {
    for (let y = 0; y < amtRows; y++) {
      if ((x % 2 === 1 && y % 2 === 0) || (x % 2 === 0 && y % 2 === 1)) {
        continue;
      }
      const p = point(
        x * densityDistance + densityDistance / 2,
        y * densityDistance + densityDistance / 2
      );

      const actualPoint = p.add(item.bounds.topLeft);
      const r = item.hitTest(actualPoint);
      if (r) {
        const c = new paper.Path.Circle(p, 0.5);
        g.addChild(c);
      }
    }
  }
  g.position = item.position;

  return g;
};

export const cutPaths = (items: Array<paper.PathItem | paper.Path>) => {
  for (let i = items.length - 1; i >= 0; i--) {
    const curr = items[i];

    for (let j = i - 1; j >= 0; j--) {
      const target = items[j];

      if (curr.intersects(target)) {
        const n = target.subtract(curr);
        target.replaceWith(n);
        items.splice(j, 1, n);
      }
    }
  }
};
