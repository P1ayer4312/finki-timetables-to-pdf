/**
 * Returns an svg colors line
 * @param {string[]} colors
 */
export default function getSvgColorsLine(colors) {
  const offsetPercent = (1 / colors.length) * 100;
  const colorRects = colors.map((color, index) => {
    return `
      <rect
        width="${offsetPercent}%" 
        height="3"
        x="${offsetPercent * index}%" 
        fill="${color}" 
      />
    `;
  });

  return `
    <svg viewBox="0 0 65 3" xmlns="http://www.w3.org/2000/svg">
      ${colorRects.join("")}
    </svg>
  `;
}
