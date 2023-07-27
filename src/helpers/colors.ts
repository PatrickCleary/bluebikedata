const orangeColor = [255, 164, 8];
const greyColor = [211, 211, 211];

export const getDivergingColor = (value) => {
  // Define RGB values for light blue, light grey, and orange
  const lightBlueColor = [0, 255, 255];

  const normalizedValue = Math.min(Math.max(value, -1), 1); // Clamp value to the range [-1, 1]
  const logValue =
    Math.sign(normalizedValue) * Math.log1p(Math.abs(normalizedValue));

  // Map the log-scaled value to the corresponding color
  const colorRange = logValue < 0 ? lightBlueColor : orangeColor;
  const absLogValue = Math.abs(logValue);
  const vibrancyMultiplier = 0.7;
  const greyAmount = vibrancyMultiplier * (1 - absLogValue);

  // Calculate the final color based on the absolute log-scaled value and the chosen color
  const color = [
    Math.round(greyAmount * greyColor[0] + absLogValue * colorRange[0]),
    Math.round(greyAmount * greyColor[1] + absLogValue * colorRange[1]),
    Math.round(greyAmount * greyColor[2] + absLogValue * colorRange[2]),
  ];

  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.5 + absLogValue})`;
};
