import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import {
  colorString,
  loadSvg,
  makeRectangle,
  point,
} from "../../utils/abstractions";
import { cutPaths, halftoneFill } from "../../utils/effects";
import { PAPER_SIZE } from "../../utils/sizes";
import { randomHexColor } from "../../utils/utils";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.05;
const PADDING_TOP = 0.1;

type SizeMod = (perc: number) => number;

const drawDashedLine = (drawingArea: paper.Rectangle, dashes = 10) => {
  const w: SizeMod = (perc) => perc * drawingArea.width;
  const h: SizeMod = (perc) => perc * drawingArea.height;

  const g1 = new paper.Group();
  const g2 = new paper.Group();

  const dashSize = 1 / dashes;

  let count = 0;
  for (let i = 0; i < 1; i += dashSize) {
    if (i + 0.0000001 >= 1) {
      break;
    }
    const p = new paper.Path();
    p.moveTo(point(w(i), h(0)));
    p.lineTo(point(w(i + dashSize), h(0)));
    if (count % 2 === 0) {
      g1.addChild(p);
    } else {
      g2.addChild(p);
    }
    count++;
  }

  return [g1, g2];
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

  const colorOne = new paper.Group();
  const colorTwo = new paper.Group();

  colorOne.pivot = point(0, 0);
  colorTwo.pivot = point(0, 0);

  for (let i = 0; i < 10; i++) {
    const [g1, g2] = drawDashedLine(
      drawingArea,
      Math.ceil(Math.random() * 10) + 1
    );
    g1.position.y = i * (drawingArea.height / 10) + drawingArea.height / 10 / 2;
    g2.position.y = i * (drawingArea.height / 10) + drawingArea.height / 10 / 2;

    colorOne.addChild(g1);
    colorTwo.addChild(g2);
  }

  colorOne.strokeColor = colorString("orange");
  colorTwo.strokeColor = colorString("lightblue");
  colorOne.strokeWidth = 20;
  colorTwo.strokeWidth = 20;

  colorOne.position.x = drawingArea.x;
  colorOne.position.y = drawingArea.y;
  colorTwo.position.x = drawingArea.x;
  colorTwo.position.y = drawingArea.y;

  const boundingBox = new paper.Path.Rectangle(drawingArea);
  boundingBox.strokeColor = colorString("red");

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
    // backgroundColor: "red",
    quickRegen: true,
  };
}

export default run;
