import paper from "paper/dist/paper-core";
import { colorString, makeRectangle, point } from "./abstractions";

type AffectTextFunc = (textObject: paper.TextItem) => void;

export const wordWrap = (
  text: string,
  area: paper.Rectangle,
  affectText?: AffectTextFunc
) => {
  const mainText = new paper.PointText(area.topLeft);
  if (affectText) affectText(mainText);

  let x = 0;
  const words = text.split(" ").map((curr) => {
    const t = mainText.clone();
    t.content = `${curr} `;

    t.remove();
    if (x + t.bounds.width > area.width) {
      x = t.bounds.width;
      return `\n${curr} `;
    }

    x += t.bounds.width;
    return `${curr} `;
  });

  mainText.content = words.join("");
  return mainText;
};

export const wordWrapPositions = (
  text: string,
  area: paper.Rectangle,
  affectText?: AffectTextFunc,
  additionalSpacing = 0
) => {
  const mainText = new paper.PointText(area.topLeft);
  if (affectText) affectText(mainText);

  const g = new paper.Group();

  let x = 0;
  let y = 0;

  text.split(" ").forEach((curr) => {
    const t = mainText.clone();
    t.content = `${curr} `;

    t.pivot = point(0, 0);

    // t.remove();
    if (x + (t.bounds.width + additionalSpacing) > area.width) {
      x = 0;
      y += t.bounds.height;
    }

    t.position.x = x;
    t.position.y = y;
    g.addChild(t);

    x += t.bounds.width + additionalSpacing;
  });

  // mainText.content = words.join("");
  return g;
};
