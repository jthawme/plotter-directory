// const BASE_PAPER_WIDTH = 8.2708333333;
// const BASE_PAPER_RATIO = 1.4142857143;

// export const getPaperSize = (dpi = 96) => {
//   return {
//     width: BASE_PAPER_WIDTH * dpi,
//     height: BASE_PAPER_WIDTH * dpi * BASE_PAPER_RATIO,
//   };
// };

export const PAPER_SIZE = {
  A3: {
    72: {
      width: 842,
      height: 1191,
    },
    96: {
      width: 1123,
      height: 1587,
    },
    150: {
      width: 1754,
      height: 2480,
    },
    300: {
      width: 3508,
      height: 4960,
    },
  },
  A4: {
    72: {
      width: 595,
      height: 842,
    },
    96: {
      width: 794,
      height: 1123,
    },
    150: {
      width: 1240,
      height: 1754,
    },
    300: {
      width: 2480,
      height: 3508,
    },
  },
  A5: {
    72: {
      width: 420,
      height: 595,
    },
    96: {
      width: 559,
      height: 794,
    },
    150: {
      width: 874,
      height: 1240,
    },
    300: {
      width: 1748,
      height: 2480,
    },
  },
  A6: {
    72: {
      width: 298,
      height: 420,
    },
    96: {
      width: 397,
      height: 559,
    },
    150: {
      width: 620,
      height: 874,
    },
    300: {
      width: 1240,
      height: 1748,
    },
  },
  A7: {
    72: { width: 210, height: 298 },
    96: { width: 280, height: 397 },
    150: { width: 437, height: 620 },
    300: { width: 874, height: 1240 },
  },
};
