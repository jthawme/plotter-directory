import paper from "paper/dist/paper-core";
import { SketchRunOptions } from "../../types";
import { ditherRaster, drawDither, loadRaster } from "../../utils/raster";
import TextureImg from "../../../assets/images/texture.jpg";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 1200;

// Width of canvas to span
const IMG_WIDTH_PERC = 1.5;

// Brightness to beat for lines
const BRIGHTNESS_THRESHOLD = 0.6;

// Sizes between slice segments
const SEGMENT_SIZE = 0.3;

// Before slicing, where to start
const STARTING_IMAGE_Y = 0;

// Height of sliced segment
const IMG_HEIGHT = 0.04;

// Amount of colour options for dithering
const QUANTIZE_FACTOR = 1;

// Scale image further before dither
const SCALE_IMAGE = 3;

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

function getSegmentX(idx: number, view: paper.View, imgWidth: number) {
  return idx % 2 === 0 ? view.bounds.width - imgWidth / 2 : imgWidth / 2;
}

async function run(paper: paper.PaperScope): SketchRunOptions {
  paper.view.viewSize.width = CANVAS_WIDTH;
  paper.view.viewSize.height = CANVAS_HEIGHT;

  const img = await loadRaster(TextureImg);

  const imgScale =
    (paper.view.viewSize.width * (IMG_WIDTH_PERC / SCALE_IMAGE)) / img.width;

  img.width = img.width * imgScale;
  img.height = img.height * imgScale;
  img.position = paper.view.center;

  ditherRaster(img, QUANTIZE_FACTOR);

  img.visible = false;

  const subImages = splitImage(
    img,
    4,
    IMG_HEIGHT * CANVAS_HEIGHT,
    STARTING_IMAGE_Y
  );

  subImages.forEach((r, i, arr) => {
    r.position.x = getSegmentX(i, paper.view, r.width);
    r.position.y = getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, r.height);
    r.visible = false;

    const d = drawDither(r, 1);
    d.position.x = getSegmentX(i, paper.view, r.width);
    d.position.y = getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, r.height);
    d.strokeColor = new paper.Color("black");
    d.strokeWidth = 0.25;
    console.log(d.position);

    if (i < arr.length - 1) {
      for (let x = 0; x < r.width; x++) {
        const p = r.getPixel(x, r.height - 1);

        if (p.brightness <= BRIGHTNESS_THRESHOLD) {
          const pa = new paper.Path([
            new paper.Point(
              x + getSegmentX(i, paper.view, r.width) - r.width / 2,
              getSegmentY(i, SEGMENT_SIZE * CANVAS_HEIGHT, r.height) +
                r.height / 2
            ),
            new paper.Point(
              x + getSegmentX(i + 1, paper.view, r.width) - r.width / 2,
              getSegmentY(i + 1, SEGMENT_SIZE * CANVAS_HEIGHT, r.height) -
                r.height / 2
            ),
          ]);

          pa.strokeColor = new paper.Color(0, 0, 0);
        }
      }
    }
  });

  img.remove();
  subImages.forEach((sub) => sub.remove());

  return {
    center: true,
    scale: true,
  };
}

export default run;
