import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { colorString, point } from "../../utils/abstractions";
import { PAPER_SIZE } from "../../utils/sizes";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.1;
const PADDING_TOP = -0.2;

function spiral(width: number, height: number, spirals: number) {
  const spiralSegment = height / spirals;

  const p = new paper.Path();
  p.moveTo(point(0, 0));

  for (let i = 0; i < spirals; i += 2) {
    const y = Math.floor(i / 2) * spiralSegment;
    const seg = (mod: number) => spiralSegment * mod + y;

    p.cubicCurveTo(
      point(0, seg(-1)),
      point(width, seg(-1)),
      point(width, seg(0))
    );
    p.cubicCurveTo(point(width, seg(2)), point(0, seg(2)), point(0, seg(1)));
  }

  return p;
}

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

  const p = spiral(drawingArea.width, drawingArea.height, 100);
  p.position = drawingArea.center;
  p.strokeColor = colorString("red");
  // p.fullySelected = true;

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
  };
}

export default run;
