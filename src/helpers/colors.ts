const orangeColor = [245, 158, 8];
const greyColor = [163, 163, 163];
const whiteColor = [240, 240, 240];
const lightBlueColor = [56, 189, 248];

export const getDivergingColor = (value, light?: boolean) => {
  // Define RGB values for light blue, light grey, and orange

  const normalizedValue = Math.min(Math.max(value * 1.5, -1), 1); // Clamp value to the range [-1, 1]
  const logValue =
    Math.sign(normalizedValue) * Math.log1p(Math.abs(normalizedValue));

  // Map the log-scaled value to the corresponding color
  const colorRange = logValue < 0 ? lightBlueColor : orangeColor;
  const absLogValue = Math.abs(logValue);

  const baseColor = light ? whiteColor : greyColor;
  const greyAmount = 1 - absLogValue;

  // Calculate the final color based on the absolute log-scaled value and the chosen color
  const color = [
    Math.round(greyAmount * baseColor[0] + absLogValue * colorRange[0]),
    Math.round(greyAmount * baseColor[1] + absLogValue * colorRange[1]),
    Math.round(greyAmount * baseColor[2] + absLogValue * colorRange[2]),
  ];

  if (light) return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.5 + absLogValue})`;
};
