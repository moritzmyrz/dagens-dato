import { atom } from 'recoil';
import { Dato } from '../functions/Date';

export const timeState = atom({
	key: 'timeState', // unique ID (with respect to other atoms/selectors)
	default: Dato, // default value (aka initial value)
});
