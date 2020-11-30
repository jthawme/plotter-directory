// const BASE_PAPER_WIDTH = 8.2708333333;
// const BASE_PAPER_RATIO = 1.4142857143;

// export const getPaperSize = (dpi = 96) => {
//   return {
//     width: BASE_PAPER_WIDTH * dpi,
//     height: BASE_PAPER_WIDTH * dpi * BASE_PAPER_RATIO,
//   };
// };

export const PAPER_SIZE = {
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
};
