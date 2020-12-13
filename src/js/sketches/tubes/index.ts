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

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A3[96];

const PADDING_LEFT = 0.05;
const PADDING_TOP = 0.1;

type SizeMod = (perc: number) => number;

const containedLine = (
  area: paper.Rectangle,
  path: paper.Path | paper.CompoundPath,
  w: SizeMod,
  h: SizeMod
) => {
  path.strokeColor = colorString(randomHexColor());

  let inBox = false;
  while (!inBox) {
    path.position.x = w(Math.random());
    path.position.y = h(Math.random());
    path.rotate(Math.random() * 360);

    if (path.isInside(area)) {
      inBox = true;
    }
    console.log("still working");
  }

  return path;
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

  const boundingBox = new paper.Path.Rectangle(drawingArea);
  boundingBox.strokeColor = colorString("red");

  const w: SizeMod = (perc) => perc * drawingArea.width;
  const h: SizeMod = (perc) => perc * drawingArea.height;

  const lines: Array<paper.Path | paper.PathItem> = new Array(8)
    .fill(0)
    .map(() => {
      const p = new paper.CompoundPath({
        children: [
          new paper.Path.Rectangle(
            new paper.Rectangle(point(0, 0), point(w(0.7), h(0.16))),
            new paper.Size(h(0.08), h(0.08))
          ),
          new paper.Path.Circle(point(h(0.08), h(0.08)), h(0.08)),
        ],
      });
      p.strokeWidth = 5;
      return containedLine(drawingArea, p, w, h);
    });

  cutPaths(lines);

  // const r1 = new paper.Path.Rectangle(point(0, 0), point(150, 50));
  // r1.fillColor = colorString("red");
  // r1.position = drawingArea.center;

  // const r2 = new paper.Path.Rectangle(point(0, 0), point(50, 150));
  // r2.fillColor = colorString("blue");
  // r2.position = drawingArea.center;

  // const r3 = r1.subtract(r2);
  // r3.fillColor = colorString("green");
  // r1.remove();
  // r2.remove();

  // lines.forEach((l) => {
  //   const f = halftoneFill(l, Math.round(Math.random() * 8 + 2));
  //   f.strokeColor = colorString("black");
  //   l.remove();
  // });

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
    // backgroundColor: "red",
    quickRegen: true,
  };
}

export default run;
