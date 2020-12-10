import * as FileSaver from "file-saver";

import paper from "paper/dist/paper-core";
import lines001Run from "./sketches/lines001";
import kintsugiRun from "./sketches/kintsugi";
import spiralRun from "./sketches/spiral";
import rotateGridRun from "./sketches/rotategrid";
import rotateGrid2Run from "./sketches/rotategrid2";
import rotateGrid3Run from "./sketches/rotategrid3";
import testsheetRun from "./sketches/testsheet";
import { SketchRun } from "./types";

const sketches: Record<string, SketchRun> = {
  lines001: lines001Run,
  kintsugi: kintsugiRun,
  spiral: spiralRun,
  rotateGrid: rotateGridRun,
  rotateGrid2: rotateGrid2Run,
  testsheet: testsheetRun,
};

const key: keyof typeof sketches = "testsheet";

class Plotter {
  static registerActions() {
    const downloadEl = document.getElementById("download") as HTMLButtonElement;

    downloadEl.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        const fileName = prompt(
          "File name",
          `plotter-${new Date().getTime()}.svg`
        );

        if (fileName == null || fileName == "") {
          return;
        }

        downloadEl.disabled = true;
        downloadEl.innerText = "Saving...";
        const blob = new Blob(
          [paper.project.exportSVG({ asString: true }).toString()],
          { type: "image/svg+xml;charset=utf-8" }
        );
        FileSaver.saveAs(blob, fileName, {
          autoBom: false,
        });

        downloadEl.disabled = false;
        downloadEl.innerText = "Download";
      },
      false
    );
  }

  static panCallback(e: MouseEvent) {
    const canvas = e.target as HTMLCanvasElement;
    const wWidth = parseInt(canvas.dataset["windowWidth"]);
    const wHeight = parseInt(canvas.dataset["windowHeight"]);
    const topScale = parseInt(canvas.dataset["topScale"]);

    const mousePerc = {
      x: e.clientX / wWidth,
      y: e.clientY / wHeight,
    };

    canvas.style.transform = `translate3d(${
      (1 - mousePerc.x - 0.5) * 100 * topScale
    }%, ${(1 - mousePerc.y - 0.5) * 100 * topScale}%, 0) scale(${topScale})`;
  }

  static setupZoom(
    el: HTMLCanvasElement,
    zoom: boolean,
    originalScale: string,
    topScale = 3.5
  ) {
    if (zoom) {
      el.style.transform = `scale(${topScale})`;
      el.dataset["windowWidth"] = window.innerWidth.toString();
      el.dataset["windowHeight"] = window.innerHeight.toString();
      el.dataset["topScale"] = topScale.toString();

      document.addEventListener("mousemove", Plotter.panCallback);
    } else {
      el.style.transform = originalScale;
      document.removeEventListener("mousemove", Plotter.panCallback);
    }
    return zoom;
  }

  static scale(
    el: HTMLCanvasElement,
    scaleFactor = 3.5,
    padding = 20,
    addListener = true
  ) {
    el.style.transform = "none";

    const { width, height } = el.getBoundingClientRect();
    const portrait = width < height;

    const transform = portrait
      ? `scale(${(window.innerHeight - padding) / height})`
      : `scale(${(window.innerWidth - padding) / width})`;
    let zoomed = false;

    el.style.transform = transform;

    el.addEventListener("dblclick", (e) => {
      zoomed = Plotter.setupZoom(el, !zoomed, transform, scaleFactor);
    });
  }

  static center() {
    document.body.classList.add("center");
  }

  static setBackground(color: string) {
    document.body.style.setProperty("--bg-color", color);
  }

  static registerRegen() {
    if (!document.body.classList.contains("regen")) {
      document.body.classList.add("regen");
      document.addEventListener("keyup", (e) => {
        if (e.key === " ") {
          Plotter.run();
        }
      });
    }
  }

  static async run() {
    const el = document.getElementById("drawing") as HTMLCanvasElement;
    const alreadyRan = !!paper.view;
    if (!alreadyRan) {
      Plotter.registerActions();
      paper.setup(el);
    } else {
      paper.project.activeLayer.removeChildren();
    }

    const {
      center = true,
      scale = true,
      scaleFactor = 3.5,
      backgroundColor,
      quickRegen,
    } = await sketches[key](paper);

    if (scale) {
      Plotter.scale(el, scaleFactor, 20, !alreadyRan);
    }

    if (center) {
      Plotter.center();
    }

    if (backgroundColor) {
      Plotter.setBackground(backgroundColor);
    }

    if (quickRegen) {
      Plotter.registerRegen();
    }
  }
}

Plotter.run();
