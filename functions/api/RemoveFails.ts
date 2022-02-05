export function removeFails(array: any) {
	array.forEach((item: any, index: any, object: any) => {
		if (item.includes('–')) {
			object.splice(index, 1);
		}
	});
}
