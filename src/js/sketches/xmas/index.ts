import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { colorString, makeRectangle, point } from "../../utils/abstractions";
import { halftoneFill } from "../../utils/effects";
import { PAPER_SIZE } from "../../utils/sizes";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A7[96];

const PADDING_LEFT = 0.05;
const PADDING_TOP = 0.1;

type LetterReturn = (size: number) => paper.Group;

const LETTER: Record<"X" | "M" | "A" | "S", LetterReturn> = {
  X: (size: number) => {
    const x = new paper.Group();
    x.addChild(new paper.Path.Line(point(0, 0), point(size, size)));
    x.addChild(new paper.Path.Line(point(size, 0), point(0, size)));
    x.remove();
    return x;
  },
  M: (size: number) => {
    const m = new paper.Group();
    m.addChild(
      new paper.Path([
        point(0, size),
        point(0, 0),
        point(size, size),
        point(size * 2, 0),
        point(size * 2, size),
      ])
    );
    m.remove();
    return m;
  },
  A: (size: number) => {
    const a = new paper.Group();
    a.addChild(
      new paper.Path([
        point(0, size),
        point(0, 0),
        point(size, 0),
        point(size, size),
      ])
    );
    a.addChild(new paper.Path.Line(point(0, size / 2), point(size, size / 2)));
    a.remove();
    return a;
  },
  S: (size: number) => {
    const s = new paper.Group();
    s.addChild(
      new paper.Path([
        point(0, size),
        point(size, size),
        point(size, size / 2),
        point(0, size / 2),
        point(0, 0),
        point(size, 0),
      ])
    );
    s.remove();
    return s;
  },
} as const;

const randomLetter = (last = false): LetterReturn => {
  const keys = Object.keys(LETTER);
  const letterKey = keys[Math.floor(Math.random() * keys.length)];

  if (last && letterKey === "M") {
    return randomLetter(last);
  }

  return LETTER[letterKey];
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

  const cols = 10;
  const cellSize = drawingArea.width / cols;
  const rows = Math.ceil(drawingArea.height / cellSize);

  // const f = makeRectangle(0, 0, cols * cellSize, rows * cellSize);
  // f.fillColor = colorString("blue");

  // const halftonef = halftoneFill(f, 20);
  // f.remove();
  // halftonef.strokeColor = colorString("red");

  // halftonef.position = drawingArea.center;

  const g = new paper.Group();

  let double = false;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (double) {
        double = false;
        continue;
      }

      const l = randomLetter(x === cols - 1)(cellSize);
      double = l.bounds.width > cellSize;
      l.pivot = point(0, 0);
      l.position = point(x * cellSize, y * cellSize);
      g.addChild(l);

      // const r = makeRectangle(, cellSize, cellSize);
      // g.addChild(r);
    }
    double = false;
  }
  g.position = drawingArea.center;
  g.strokeColor = colorString("white");

  const outside = makeRectangle(
    0,
    0,
    paper.view.viewSize.width,
    paper.view.viewSize.height
  );
  outside.strokeColor = colorString("red");

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
    backgroundColor: "black",
    quickRegen: true,
  };
}

export default run;
