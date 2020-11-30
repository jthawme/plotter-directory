import * as FileSaver from "file-saver";

import paper from "paper/dist/paper-core";
import lines001Run from "./sketches/lines001";
import kintsugiRun from "./sketches/kintsugi";
import { SketchRun } from "./types";

const sketches: Record<string, SketchRun> = {
  lines001: lines001Run,
  kintsugi: kintsugiRun,
};

const key: keyof typeof sketches = "kintsugi";

class Plotter {
  static registerActions() {
    const downloadEl = document.getElementById("download");

    downloadEl.addEventListener(
      "click",
      (e) => {
        e.preventDefault();

        const blob = new Blob(
          [paper.project.exportSVG({ asString: true }).toString()],
          { type: "image/svg+xml;charset=utf-8" }
        );
        FileSaver.saveAs(blob, "plotter.svg", {
          autoBom: false,
        });
      },
      false
    );
    // .onclick = function () {
    //   console.log("clicked?");
    //   var fileName = "custom.svg";
    //   var url =
    //     "data:image/svg+xml;utf8," +
    //     encodeURIComponent(
    //       paper.project.exportSVG({ asString: true }).toString()
    //     );
    //   var link = document.createElement("a");
    //   link.download = fileName;
    //   link.href = url;
    //   link.click();
    // });
  }
  static scale(el: HTMLCanvasElement, padding = 20) {
    const { width, height } = el.getBoundingClientRect();
    const portrait = width < height;

    if (portrait) {
      el.style.transform = `scale(${(window.innerHeight - padding) / height})`;
    } else {
      el.style.transform = `scale(${(window.innerWidth - padding) / width})`;
    }
  }

  static center() {
    document.body.classList.add("center");
  }

  static async run() {
    Plotter.registerActions();

    const el = document.getElementById("drawing") as HTMLCanvasElement;
    paper.setup(el);

    const { center = true, scale = true } = await sketches[key](paper);

    if (scale) {
      Plotter.scale(el);
    }

    if (center) {
      Plotter.center();
    }
  }
}

Plotter.run();
