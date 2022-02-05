import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Button, ButtonGroup, Tooltip, Zoom } from '@mui/material';
import React, { useState } from 'react';
import { CgCalendarToday } from 'react-icons/cg';
import { MdChevronLeft, MdChevronRight, MdHome } from 'react-icons/md';
import { useRecoilState } from 'recoil';
import { timeState } from '../state/timeState';

const ButtonBar = () => {
	const [time, setTime] = useRecoilState(timeState);

	const [selectDateDialog, setSelectDateDialog] = useState(false);

	const day = 86400000;

	const handleSetDateChange = (date: Date) => {
		setTime(date);
		setSelectDateDialog(false);
	};

	return (
		<div className="w-[97%] sm:w-[450px]">
			<ButtonGroup
				disableElevation
				className="bg-backgroundsecondary  h-12 w-full flex flex-nowrap  rounded-xl"
			>
				<Tooltip title="Forrige Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							handleSetDateChange(new Date(time.getTime() - day));
						}}
					>
						<MdChevronLeft className="h-6 w-6 text-text" />
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
						<MdHome className="h-6 w-6 text-text" />
					</Button>
				</Tooltip>
				<LocalizationProvider dateAdapter={DateFnsUtils}>
					<DatePicker
						format="dd/MM"
						renderInput={(params: any) => (
							<Tooltip title="Velg Dato" arrow TransitionComponent={Zoom}>
								<Button
									variant="contained"
									className="flex-1"
									onClick={() => {
										setSelectDateDialog(true);
									}}
								>
									<CgCalendarToday className="h-6 w-6 text-text" />
								</Button>
							</Tooltip>
						)}
						open={selectDateDialog}
						onClose={() => setSelectDateDialog(false)}
						value={time}
						onChange={handleSetDateChange}
					/>
				</LocalizationProvider>
				<Tooltip title="Neste Dato" arrow TransitionComponent={Zoom}>
					<Button
						variant="contained"
						className="flex-1"
						onClick={() => {
							handleSetDateChange(new Date(time.getTime() + day));
						}}
					>
						<MdChevronRight className="h-6 w-6 text-text" />
					</Button>
				</Tooltip>
			</ButtonGroup>
		</div>
	);
};

export default ButtonBar;
