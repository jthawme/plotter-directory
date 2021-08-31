import slugify from "slugify";

export const loadFont = async (name) => {
  const id = `font-${slugify(name.split(".").shift())}`;

  if (document.getElementById(id)) {
    return id;
  }

  const styleEl = document.createElement("style");
  styleEl.id = id;

  styleEl.innerHTML = `
  @font-face {
    font-family: '${id}';
    src: url('${name}') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}
`;

  document.head.appendChild(styleEl);

  await fetch(name).then((resp) => resp.blob());

  const span = document.createElement("span");
  span.innerText = id;
  span.style.fontFamily = `'${id}'`;
  document.body.appendChild(span);

  return id;
};
