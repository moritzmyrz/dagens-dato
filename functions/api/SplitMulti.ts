export function splitMulti(str: any, tokens: any[]): string[] {
	var tempChar = tokens[0]; // We can use the first token as a temporary join character
	for (var i = 1; i < tokens.length; i++) {
		str = str.split(tokens[i]).join(tempChar);
	}
	str = str.split(tempChar);
	return str;
}
