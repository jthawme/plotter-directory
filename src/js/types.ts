export type SketchRunOptions = Promise<{
  center?: boolean;
  scale?: boolean;
  scaleFactor?: number;
}>;

export type SketchRun = (p: paper.PaperScope) => SketchRunOptions;
