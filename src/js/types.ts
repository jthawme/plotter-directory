export type SketchRunOptions = Promise<{
  center?: boolean;
  scale?: boolean;
}>;

export type SketchRun = (p: paper.PaperScope) => SketchRunOptions;
