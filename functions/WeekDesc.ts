import { GetMonth } from "./GetMonth";

export function weekDescription(start: Date, end: Date): string {
	if (start.getFullYear() == end.getFullYear()) {
		if (start.getMonth() == end.getMonth()) {
			return `Man ${start.getDate()}. - Søn ${end.getDate()}. ${GetMonth(
				end.getMonth()
			)} ${end.getFullYear()}`;
		} else {
			return `Man ${start.getDate()}. ${GetMonth(
				start.getMonth()
			)} - Søn ${end.getDate()}. ${GetMonth(
				end.getMonth()
			)} ${end.getFullYear()}`;
		}
	} else {
		if (start.getMonth() == end.getMonth()) {
			return `Man ${start.getDate()}. - Søn ${end.getDate()}. ${GetMonth(
				end.getMonth()
			)} ${end.getFullYear()}`;
		} else {
			return `Man ${start.getDate()}. ${GetMonth(
				start.getMonth()
			)} ${start.getFullYear()} - Søn ${end.getDate()}. ${GetMonth(
				end.getMonth()
			)} ${end.getFullYear()}`;
		}
	}
}
