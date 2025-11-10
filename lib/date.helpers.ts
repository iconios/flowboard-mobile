// Convert ISO to datetime-local for input display
export const isoToDate = (isoString: string): Date => {
  if (!isoString) return new Date();
  return new Date(isoString);
};

// Convert datetime-local to ISO for server
export const dateToIso = (date: Date): string => {
  if (!date) return "";
  // Append seconds and milliseconds, assume local timezone
  return date.toISOString();
};
