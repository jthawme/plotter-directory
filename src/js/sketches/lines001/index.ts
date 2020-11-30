import { SketchRunOptions } from "../../types";

function run(paper: paper.PaperScope): SketchRunOptions {
  var path = new paper.Path();
  // Give the stroke a color
  path.strokeColor = new paper.Color("black");
  var start = new paper.Point(100, 100);
  // Move to start and draw a line from there
  path.moveTo(start);
  // Note that the plus operator on Point objects does not work
  // in JavaScript. Instead, we need to call the add() function:
  path.lineTo(start.add(new paper.Point(100, 100)));
  // Draw the view now:
  // paper.view.draw();

  return {
    center: true,
  };
}

export default run;
