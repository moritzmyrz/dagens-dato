// eslint-disable-next-line
const GetWeekNum = function (date: Date) {
  // eslint-disable-next-line
  const target: any = new Date(date.valueOf());
  const dayNumber = (date.getUTCDay() + 6) % 7;

  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday: number = target.valueOf();
  target.setUTCMonth(0, 1);

  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }

  return Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000)) + 1;
};

export { GetWeekNum };
