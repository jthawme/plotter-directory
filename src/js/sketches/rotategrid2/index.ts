import paper from "paper/dist/paper-core";
import tumult from "tumult";
import { SketchRunOptions } from "../../types";
import { colorString, makeRectangle, point } from "../../utils/abstractions";
import { PAPER_SIZE } from "../../utils/sizes";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.1;
const PADDING_TOP = 0.2;

const simplex2 = new tumult.Simplex2();
const randMod = 15;

const drawGrid = (
  size: number,
  drawingArea: paper.Rectangle,
  offset = 0,
  advance = 1,
  startingNum = 0
) => {
  const g = new paper.Group();

  const cols = Math.floor(drawingArea.width / size);
  const rows = Math.floor(drawingArea.height / size);

  for (let y = startingNum; y < rows; y += advance) {
    const line = new paper.Path();
    for (let x = 0; x < cols; x++) {
      const rand = simplex2.gen((x + offset) / randMod, (y + offset) / randMod);

      const tl = point(x * size, y * size);
      const br = point((x + 1) * size, (y + 1) * size);
      const c = point(x * size + size / 2, y * size + size / 2);

      const l = new paper.Path.Line(tl, br);
      l.position = c;
      l.rotation = rand * 90 + 45;
      l.scale(1.5);

      const p = l.getPointAt(0);

      line.add(p);

      l.remove();

      // g.addChild(l);
      // const r = makeRectangle(tl.x, tl.y, size, size);
      // g.addChild(r);
    }

    g.addChild(line);
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

  const overall = new paper.Group();

  const grid = drawGrid(5, drawingArea, 0, 2, 0);
  grid.strokeColor = colorString("blue");
  overall.addChild(grid);

  const grid2 = drawGrid(5, drawingArea, 0, 2, 1);
  grid2.strokeColor = colorString("green");
  overall.addChild(grid2);

  const grid3 = drawGrid(5, drawingArea, 0.5, 2, 0);
  grid3.strokeColor = colorString("red");
  overall.addChild(grid3);

  const grid4 = drawGrid(5, drawingArea, 0.5, 2, 1);
  grid4.strokeColor = colorString("red");
  overall.addChild(grid4);

  overall.position = drawingArea.center;

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
    backgroundColor: "black",
  };
}

export default run;
