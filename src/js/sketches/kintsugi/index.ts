import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { ditherRaster, drawDither, loadRaster } from "../../utils/raster";
import { PAPER_SIZE } from "../../utils/sizes";
import TextureImg from "../../../assets/images/texture.jpg";
// import TextureImg from "../../../assets/images/trees.jpg";
// import TextureImg from "../../../assets/images/stairs.jpg";

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = PAPER_SIZE.A4[96];

// Width of canvas to span
const IMG_WIDTH_PERC = 0.75;

// Brightness to beat for lines
const BRIGHTNESS_THRESHOLD = 0.95;

// Sizes between slice segments
const SEGMENT_SIZE = 0.2;

// Before slicing, where to start
const STARTING_IMAGE_Y = 0;

// Height of sliced segment
const IMG_HEIGHT = 0.05;

// Amount of colour options for dithering
const QUANTIZE_FACTOR = 1;

// Scale image further before dither
const SCALE_IMAGE = 2;

const LINE_SKIP = SCALE_IMAGE;
// const LINE_SKIP = 1;

const PADDING_TOP = 0.12;
const PADDING_LEFT = 0.03;

function splitImage(
  img: paper.Raster,
  segments: number,
  size: number,
  startingY = 0
): paper.Raster[] {
  return new Array(segments).fill(0).map((c, i) => {
    return img.getSubRaster(
      new paper.Rectangle(0, i * size + startingY, img.width, size)
    );
  });
}

function getSegmentY(idx: number, segmentSize: number, imgHeight: number) {
  return idx * segmentSize + imgHeight / 2;
}

function getSegmentX(idx: number, view: paper.Rectangle, imgWidth: number) {
  return idx % 2 === 0 ? view.width - imgWidth / 2 : imgWidth / 2;
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

  const img = await loadRaster(TextureImg);

  const imgScale =
    (drawingArea.width * (IMG_WIDTH_PERC / SCALE_IMAGE)) / img.width;

  img.width = img.width * imgScale;
  img.height = img.height * imgScale;
  img.position = drawingArea.center;

  ditherRaster(img, QUANTIZE_FACTOR);

  img.visible = false;

  const subImages = splitImage(
    img,
    4,
    (IMG_HEIGHT / SCALE_IMAGE) * CANVAS_HEIGHT,
    STARTING_IMAGE_Y
  );

  subImages.forEach((r, i, arr) => {
    const actualWidth = r.width * SCALE_IMAGE;
    const actualHeight = r.height * SCALE_IMAGE;

    r.position.x = getSegmentX(i, drawingArea, actualWidth) + drawingArea.x;
    r.position.y =
      getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, actualHeight) +
      drawingArea.y;
    r.visible = false;

    const d = drawDither(r, SCALE_IMAGE);
    d.position.x = getSegmentX(i, drawingArea, actualWidth) + drawingArea.x;
    d.position.y =
      getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, actualHeight) +
      drawingArea.y;
    d.fillColor = new paper.Color("black");

    const lineGroup = new paper.Group();

    if (i < arr.length - 1) {
      for (let x = 0; x < r.width; x += LINE_SKIP) {
        const p = r.getPixel(x, r.height - 2);

        if (p.brightness <= BRIGHTNESS_THRESHOLD) {
          const pa = new paper.Path([
            new paper.Point(
              x * SCALE_IMAGE +
                getSegmentX(i, drawingArea, actualWidth) -
                actualWidth / 2,
              getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, actualHeight) +
                actualHeight / 2 -
                SCALE_IMAGE
            ),
            new paper.Point(
              x * SCALE_IMAGE +
                getSegmentX(i + 1, drawingArea, actualWidth) -
                actualWidth / 2,
              getSegmentY(i + 1, SEGMENT_SIZE * CANVAS_HEIGHT, actualHeight) -
                actualHeight / 2 +
                SCALE_IMAGE
            ),
          ]);

          lineGroup.addChild(pa);

          pa.strokeColor = new paper.Color(0, 0, 0);
        }
      }
    }

    lineGroup.position.x = drawingArea.x + drawingArea.width / 2;
    lineGroup.position.y =
      drawingArea.y +
      i * (SEGMENT_SIZE * CANVAS_HEIGHT) +
      actualHeight +
      lineGroup.bounds.height / 2 -
      SCALE_IMAGE;
  });

  img.remove();
  subImages.forEach((sub) => sub.remove());

  return {
    center: true,
    scale: true,
  };
}

export default run;
