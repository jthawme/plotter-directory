import paper from "paper/dist/paper-core";

export const loadRaster = (src: string): Promise<paper.Raster> => {
  return new Promise((resolve, reject) => {
    const r = new paper.Raster(src);
    r.onLoad = () => {
      resolve(r);
    };
  });
};

const defaultDither = (pixel: paper.Color, factor: number): paper.Color => {
  const G = Math.round(pixel.gray * factor) / factor;
  return new paper.Color(G, G, G);
};

export const ditherRaster = (
  r: paper.Raster,
  factor: number,
  ditherTransform = defaultDither
) => {
  for (let y = 0; y < r.height - 1; y++) {
    for (let x = 1; x < r.width - 1; x++) {
      const oldPixel = r.getPixel(x, y);
      const newPixel = ditherTransform(oldPixel, factor);
      r.setPixel(x, y, newPixel);

      const error = oldPixel.subtract(newPixel);

      r.setPixel(x + 1, y, r.getPixel(x + 1, y).add(error.multiply(7 / 16)));
      r.setPixel(
        x - 1,
        y + 1,
        r.getPixel(x - 1, y + 1).add(error.multiply(3 / 16))
      );
      r.setPixel(x, y + 1, r.getPixel(x, y + 1).add(error.multiply(5 / 16)));
      r.setPixel(
        x + 1,
        y + 1,
        r.getPixel(x + 1, y + 1).add(error.multiply(1 / 16))
      );
    }
  }
};

export function drawDither(
  img: paper.Raster,
  scaled: number,
  inset = 1,
  dotSize = 0.5
) {
  const vectorDither = new paper.Group();
  for (let y = inset; y < img.height - inset; y++) {
    for (let x = inset; x < img.width - inset; x++) {
      if (img.getPixel(x, y).brightness !== 1) {
        const r = new paper.Path.Circle(
          new paper.Point(x * scaled + scaled / 2, y * scaled + scaled / 2),
          dotSize
        );
        vectorDither.addChild(r);
      }
    }
  }

  return vectorDither;
}
