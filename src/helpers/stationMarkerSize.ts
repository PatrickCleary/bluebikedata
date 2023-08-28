export const getSize = (
  inside,
  isMobile,
  startStationsSelected,
  absValue,
  percentageValue
) => {
  if (inside) return isMobile ? 4 : 6;
  if (startStationsSelected && absValue === undefined) {
    return 0;
  }
  if (absValue !== undefined && percentageValue)
    return isMobile ? percentageValue * 20 : percentageValue * 32;
  if (absValue === 0 && percentageValue === 0) {
    return 0;
  }
  return isMobile ? 6 : 6;
};
