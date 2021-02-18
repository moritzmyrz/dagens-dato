function GetMonth(month: number): string {
  const months: string[] = [
    "Januar",
    "Februar",
    "Mars",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return months[month];
}

export { GetMonth };
