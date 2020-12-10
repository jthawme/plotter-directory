import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { colorString, loadSvg, point } from "../../utils/abstractions";
import { PAPER_SIZE } from "../../utils/sizes";
import Letter from "./letter.svg";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.1;
const PADDING_TOP = 0.2;

const ROW_GUTTER = 20;
const CELL_SIZE = 50;

let letter: paper.Item;

const halftoneCell = (
  size: number,
  densityDistance: number,
  widthRatio = 1
) => {
  const g = new paper.Group();
  const amtCols = Math.floor((size * widthRatio) / densityDistance);
  const amtRows = Math.floor(size / densityDistance);

  for (let x = 0; x < amtCols; x++) {
    for (let y = 0; y < amtRows; y++) {
      if ((x % 2 === 1 && y % 2 === 0) || (x % 2 === 0 && y % 2 === 1)) {
        continue;
      }
      const c = new paper.Path.Circle(
        point(
          x * densityDistance + densityDistance / 2,
          y * densityDistance + densityDistance / 2
        ),
        0.5
      );
      g.addChild(c);
    }
  }
  return g;
};

const halftoneRow = (
  size = CELL_SIZE,
  gutter = ROW_GUTTER,
  sizes = [2, 5, 10, 15],
  ratio = [1, 1, 1, 2]
) => {
  const g = new paper.Group();

  sizes.forEach((s, idx) => {
    const c = halftoneCell(size, s, ratio[idx]);
    c.pivot = point(0, 0);

    const previousRatios = ratio
      .filter((r, i) => i < idx)
      .reduce((prev, curr) => prev + curr, 0);

    c.position.x = previousRatios * size + idx * gutter;
    g.addChild(c);
  });

  return g;
};

const lineDensityCell = (
  size: number,
  densityDistance: number,
  widthRatio = 1
) => {
  const g = new paper.Group();
  const amt = Math.floor((size * widthRatio) / densityDistance);

  const b = new paper.Path.Rectangle(
    point(0, 0),
    point(size * widthRatio, size)
  );
  g.addChild(b);

  for (let i = 0; i < amt; i++) {
    const l = new paper.Path.Line(
      point(i * densityDistance, 0),
      point(i * densityDistance, size)
    );
    g.addChild(l);
  }

  return g;
};

const lineDensityRow = (
  size = CELL_SIZE,
  gutter = ROW_GUTTER,
  sizes = [2, 5, 10, 25, 50],
  ratio = [1, 1, 1, 2, 3]
) => {
  const g = new paper.Group();

  sizes.forEach((s, idx) => {
    const c = lineDensityCell(size, s, ratio[idx]);
    c.pivot = point(0, 0);

    const previousRatios = ratio
      .filter((r, i) => i < idx)
      .reduce((prev, curr) => prev + curr, 0);

    c.position.x = previousRatios * size + idx * gutter;
    g.addChild(c);
  });

  return g;
};

const textRow = (size = CELL_SIZE, sizes = [1, 0.75, 0.5]) => {
  const g = new paper.Group();

  sizes.forEach((s, idx) => {
    const ig = new paper.Group();
    const r = new paper.Path.Rectangle(point(0, 0), point(size * s, size));
    ig.addChild(r);

    const l = letter.clone();
    l.fillColor = null;
    l.fitBounds(new paper.Rectangle(point(0, 0), point(size * s, size * s)));
    l.position = ig.position;
    ig.addChild(l);

    r.remove();

    ig.position.x = g.bounds.width + ROW_GUTTER;
    g.addChild(ig);
  });

  return g;
};

const testRow = () => {
  const g = new paper.Group();
  const ld = lineDensityRow();
  g.addChild(ld);
  const h = halftoneRow();
  h.pivot = point(0, 0);
  h.position.y = ld.bounds.height + ROW_GUTTER;
  g.addChild(h);

  const t = textRow();
  t.pivot = point(0, 0);
  t.position.x = ld.bounds.width + ROW_GUTTER;
  g.addChild(t);

  g.strokeColor = colorString("red");

  return g;
};

async function run(paper: paper.PaperScope): SketchRunOptions {
  paper.view.viewSize.width = CANVAS_WIDTH;
  paper.view.viewSize.height = CANVAS_HEIGHT;

  const drawingArea = new paper.Rectangle(
    new paper.Point(
      paper.view.viewSize.width * PADDING_LEFT,
      paper.view.viewSize.height * PADDING_TOP
    ),
    new paper.Point(
      paper.view.viewSize.width * (1 - PADDING_LEFT),
      paper.view.viewSize.height * (1 - PADDING_TOP)
    )
  );

  letter = await loadSvg(Letter);

  const g = new paper.Group();

  for (let i = 0; i < 4; i++) {
    const l = testRow();
    l.pivot = point(0, 0);
    l.position.y = i * l.bounds.height + i * ROW_GUTTER * 3;
    g.addChild(l);
  }

  g.position = drawingArea.center;

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
  };
}

export default run;
