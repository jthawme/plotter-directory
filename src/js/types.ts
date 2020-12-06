export type SketchRunOptions = Promise<{
  center?: boolean;
  scale?: boolean;
  scaleFactor?: number;
  backgroundColor?: string;
  quickRegen?: boolean;
}>;

export type SketchRun = (p: paper.PaperScope) => SketchRunOptions;
