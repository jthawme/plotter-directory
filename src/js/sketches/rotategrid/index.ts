import paper from "paper/dist/paper-core";
import tumult from "tumult";
import { SketchRunOptions } from "../../types";
import { colorString, makeRectangle, point } from "../../utils/abstractions";
import { PAPER_SIZE } from "../../utils/sizes";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.1;
const PADDING_TOP = 0.2;

const simplex2 = new tumult.Simplex2();
const randMod = 100;

const drawGrid = (size: number, drawingArea: paper.Rectangle) => {
  const g = new paper.Group();

  const cols = Math.floor(drawingArea.width / size);
  const rows = Math.floor(drawingArea.height / size);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const rand = simplex2.gen(x / randMod, y / randMod);

      const tl = point(x * size, y * size);
      const br = point((x + 1) * size, (y + 1) * size);
      const c = point(x * size + size / 2, y * size + size / 2);

      const l = new paper.Path.Line(tl, br);
      l.position = c;
      l.rotation = rand * 90 + 45;
      l.scale(1.5);

      g.addChild(l);
      // const r = makeRectangle(tl.x, tl.y, size, size);
      // g.addChild(r);
    }
  }

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

  const r = new paper.Path(drawingArea);
  r.strokeColor = colorString("green");

  const grid = drawGrid(25, drawingArea);
  grid.strokeColor = colorString("red");
  grid.position = drawingArea.center;

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
  };
}

export default run;
