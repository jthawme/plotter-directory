import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import {
  colorString,
  loadSvg,
  makeRectangle,
  point,
} from "../../utils/abstractions";
import { halftoneFill } from "../../utils/effects";
import { PAPER_SIZE } from "../../utils/sizes";
import { wordWrap, wordWrapPositions } from "../../utils/text";

import TreeSvg from "./tree.svg";
import MarkSvg from "./mark.svg";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A6[96];

const PADDING_LEFT = 0.05;
const PADDING_TOP = 0.1;

const STROKE_COLOR = "black";

const FACTS = [
  "Branches from evergreen trees were used during winter solstice as a reminder of the green plants that would grow in spring when the sun gods grew strong. These evergreen branches became the foundation of our Christmas tree.",
  'We leave carrots for Santa Claus reindeer because, in Norse mythology, people left hay and treats for Odin’s eight-legged horse, Sleipnir, "in hopes the god would stop by their home during his Yule hunting adventures."',
  "Mistletoe is actually a parasite, sucking nutrients from its host tree in order to stay festively green all winter long. If enough mistletoe attaches to a tree, it will eventually kill it.",
  "Boxing Day gets its name from all the money collected in church alms-boxes for the poor.",
  "It’s technically illegal to eat mince pies on Christmas Day in England. In the 17th century, Oliver Cromwell banned Christmas pudding, mince pies and anything to do with gluttony. The law has never been rescinded.",
  "The abbreviation Xmas isn’t irreligious. The letter X is a Greek abbreviation for Christ.",
  "Many parts of the Christmas tree can actually be eaten, with the needles being a good source of Vitamin C.",
  "Mariah Carey makes about £375,000 per year from All I Want For Christmas and the Pogues make about £400,000 from Fairytale of New York. But top of the tree are Slade, who are reckoned to earn £500,000 per year from Merry Christmas Everybody,",
  "In Home Alone, the ugly photo of Buzz’s girlfriend is actually a boy because director Chris Columbus thought it would be too cruel to make fun of a real girl. The boy used in the picture is the art director’s son.",
  "62,824 - The record number of Christmas cards sent by a single person in a year. At the time of writing, that would cost £40,207.36 in first class stamps.",
  "Japanese people traditionally eat at KFC for Christmas dinner, thanks to a successful marketing campaign 40 years ago. KFC is so popular that customers must place their Christmas orders 2 months in advance.",
  "A large part of Sweden’s population watches Donald Duck cartoons every Christmas Eve – a tradition that started in 1960.",
];

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

const getCellSize = (cols: number, drawingArea: paper.Rectangle) => {
  const cellSize = drawingArea.width / cols;
  const rows = Math.ceil(drawingArea.height / cellSize);

  return { cols, cellSize, rows };
};

const drawFrontRandom = (drawingArea: paper.Rectangle) => {
  const g = new paper.Group();

  const { cols, cellSize, rows } = getCellSize(10, drawingArea);

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

  return g;
};

const addMarks = async (bounds: paper.Rectangle) => {
  const mark = await loadSvg(MarkSvg, false);

  const markGroup = new paper.Group();

  const mtl = mark.clone();
  mtl.pivot = point(0, 0);
  mtl.position = bounds.topLeft;
  markGroup.addChild(mtl);

  const mtr = mark.clone();
  mtr.pivot = point(mark.bounds.width, 0);
  mtr.position = bounds.topRight;
  markGroup.addChild(mtr);

  const mbl = mark.clone();
  mbl.pivot = point(0, mark.bounds.height);
  mbl.position = bounds.bottomLeft;
  markGroup.addChild(mbl);

  const mbr = mark.clone();
  mbr.pivot = point(mark.bounds.width, mark.bounds.height);
  mbr.position = bounds.bottomRight;
  markGroup.addChild(mbr);

  return markGroup;
};

async function run(paper: paper.PaperScope): SketchRunOptions {
  paper.view.viewSize.width = CANVAS_HEIGHT;
  paper.view.viewSize.height = CANVAS_WIDTH;

  const fullPage = new paper.Rectangle(
    paper.view.bounds.topLeft,
    paper.view.bounds.bottomRight
  );
  const leftPage = new paper.Rectangle(
    paper.view.bounds.topLeft,
    paper.view.bounds.bottomCenter
  );
  const rightPage = new paper.Rectangle(
    paper.view.bounds.topCenter,
    paper.view.bounds.bottomRight
  );

  const drawingAreaSize = new paper.Rectangle(
    new paper.Point(
      rightPage.width * PADDING_LEFT,
      rightPage.height * PADDING_TOP
    ),
    new paper.Point(
      rightPage.width * (1 - PADDING_LEFT),
      rightPage.height * (1 - PADDING_TOP)
    )
  );

  const leftDrawingArea = drawingAreaSize.clone();
  leftDrawingArea.width *= 0.8;
  leftDrawingArea.center = leftPage.center;

  const drawingArea = drawingAreaSize.clone();
  drawingArea.center = rightPage.center;

  const marks = await addMarks(fullPage);
  marks.strokeColor = colorString(STROKE_COLOR);

  // FRONT PAGE
  const tree = await loadSvg(TreeSvg, false);
  const tr = tree.clone();
  tr.strokeColor = colorString(STROKE_COLOR);
  paper.project.activeLayer.addChild(tr);
  tr.position = leftPage.center;

  const random = drawFrontRandom(drawingArea);
  random.strokeColor = colorString(STROKE_COLOR);

  // INSIDE PAGE
  // const { cols, cellSize, rows } = getCellSize(10, drawingArea);
  // const f = makeRectangle(0, 0, cols * cellSize, rows * cellSize);
  // f.fillColor = colorString("blue");

  // const halftonef = halftoneFill(f, 20);
  // f.remove();
  // halftonef.strokeColor = colorString(STROKE_COLOR);

  // halftonef.position = drawingArea.center;

  // const text = wordWrap(FACTS[11], leftDrawingArea, (textItem) => {
  //   textItem.fontFamily = "Times";
  //   textItem.fontSize = 15;
  //   textItem.leading = textItem.fontSize * 1.4;
  // });
  // text.position.y = leftDrawingArea.center.y;
  // text.position.x = leftDrawingArea.center.x;

  // const r = new paper.Path.Rectangle(leftDrawingArea);
  // r.strokeColor = colorString("red");

  return {
    center: true,
    scale: true,
    scaleFactor: 4,
    // backgroundColor: "red",
    quickRegen: true,
  };
}

export default run;
