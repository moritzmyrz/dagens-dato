import DateFnsUtils from '@date-io/date-fns';
import { Button, ButtonGroup, Tooltip, Zoom } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useState } from 'react';
import { CgCalendarToday } from 'react-icons/cg';
import { MdChevronLeft, MdChevronRight, MdHome } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { timeState } from '../state/timeState';

const ButtonBar = () => {
	const [time, setTime] = useRecoilState(timeState);

	const [selectDateDialog, setSelectDateDialog] = useState(false);

	const day = 86400000;

	const handleSetDateChange = (
		date: Date | null,
		keyboardInputValue?: string | undefined
	) => {
		setTime(date || new Date());
		setSelectDateDialog(false);
	};

	return (
		<div className="w-[97%] sm:w-[500px]">
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					disableToolbar
					style={{ display: 'none' }}
					format="dd/MM"
					open={selectDateDialog}
					// @ts-ignore
					onClose={() => {
						setSelectDateDialog(false);
					}}
					value={time}
					cancelLabel="Avbryt"
					okLabel="OK"
					onChange={handleSetDateChange}
				/>
			</MuiPickersUtilsProvider>
			<ButtonGroup
				disableElevation
				className="!bg-backgroundsecondary flex h-12 w-full flex-nowrap rounded-xl"
			>
				<Tooltip title="Forrige Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							handleSetDateChange(new Date(time.getTime() - day));
						}}
					>
						<MdChevronLeft className="text-text h-6 w-6" />
					</Button>
				</Tooltip>
				<Tooltip title="Dagens Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							handleSetDateChange(new Date());
						}}
					>
						<MdHome className="text-text h-6 w-6" />
					</Button>
				</Tooltip>
				<Tooltip title="Velg Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							setSelectDateDialog(true);
						}}
					>
						<CgCalendarToday className="text-text h-6 w-6" />
					</Button>
				</Tooltip>
				<Tooltip title="Neste Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							handleSetDateChange(new Date(time.getTime() + day));
						}}
					>
						<MdChevronRight className="text-text h-6 w-6" />
					</Button>
				</Tooltip>
			</ButtonGroup>
		</div>
	);
};

export default ButtonBar;
