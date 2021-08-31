import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { colorString, point } from "../../utils/abstractions";
import { PAPER_SIZE } from "../../utils/sizes";
import font from "../../../assets/fonts/F37GingerPro-Demi.woff2";
import { loadFont } from "../../utils/font";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

const PADDING_LEFT = 0.05;
const PADDING_TOP = 0.1;

type SizeMod = (perc: number) => number;

async function run(paper: paper.PaperScope): SketchRunOptions {
  const fontName = await loadFont(font);

  paper.view.viewSize.width = CANVAS_WIDTH;
  paper.view.viewSize.height = CANVAS_HEIGHT;

  const margin = paper.view.viewSize.width * 0.025;

  const drawingArea = new paper.Rectangle(
    new paper.Point(margin * 2, margin * 2),
    new paper.Point(
      paper.view.viewSize.width - margin * 2,
      paper.view.viewSize.height - margin * 2
    )
  );

  const boundingBox = new paper.Path.Rectangle(drawingArea);
  boundingBox.strokeColor = colorString("red");

  const drawWord = (_x: number, _y: number, word: string) => {
    const letters = word.split("");

    const g = new paper.Group();

    let x = 0;
    let heights = [];
    letters.forEach((l) => {
      const t = new paper.PointText(point(x, 0));
      t.fontFamily = fontName;
      t.fontSize = "80px";
      t.content = l;
      heights.push(t.bounds.height);
      x += t.bounds.width;

      g.addChild(t);
    });

    g.position.x = _x;
    g.position.y = _y + Math.max(...heights);

    return g;
  };

  const word = drawWord(0, 0, "Tester");
  word.position = drawingArea.center;

  const t = new paper.PointText(point(0, 0));
  t.fontFamily = fontName;
  t.fontSize = "80px";
  t.content = "Tester";
  t.position = drawingArea.center;
  t.position.y += 50;

  return {
    center: true,
    scale: true,
    scaleFactor: 2,
    // backgroundColor: "red",
    quickRegen: true,
  };
}

export default run;
