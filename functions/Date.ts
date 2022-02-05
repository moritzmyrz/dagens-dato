export const Timer = (date?: number | Date): Date => {
	if (date) return new Date(date);
	else return new Date();
};

export const Dato = Timer();
