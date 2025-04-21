import DateFnsUtils from "@date-io/date-fns";
import { Button, ButtonGroup, Tooltip, Zoom } from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import { CgCalendarToday } from "react-icons/cg";
import { MdChevronLeft, MdChevronRight, MdHome } from "react-icons/md";

interface ButtonBarProps {
  currentDate: Date;
}

const ButtonBar: React.FC<ButtonBarProps> = ({ currentDate }) => {
  const router = useRouter();

  const [selectDateDialog, setSelectDateDialog] = useState(false);

  const formatDateSlug = (date: Date): string => {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  const todayDate = new Date();

  const prevDateSlug = formatDateSlug(prevDate);
  const nextDateSlug = formatDateSlug(nextDate);
  const todayDateSlug = formatDateSlug(todayDate);

  const handleDatePickerChange = (date: Date | null) => {
    setSelectDateDialog(false);
    if (date) {
      const newSlug = formatDateSlug(date);
      router.push(`/date/${newSlug}`);
    }
  };

  return (
    <div className="w-[97%] sm:w-[500px]">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableToolbar
          style={{ display: "none" }}
          format="dd/MM/yyyy"
          open={selectDateDialog}
          onClose={() => setSelectDateDialog(false)}
          value={currentDate}
          cancelLabel="Avbryt"
          okLabel="OK"
          onChange={handleDatePickerChange}
        />
      </MuiPickersUtilsProvider>
      <ButtonGroup
        disableElevation
        className="!bg-backgroundsecondary flex h-12 w-full flex-nowrap rounded-xl"
      >
        <Link href={`/date/${prevDateSlug}`} passHref>
          <Tooltip title="Forrige Dato" arrow TransitionComponent={Zoom}>
            <Button
              component="a"
              variant="contained"
              className="flex-1"
              aria-label="Forrige dato"
            >
              <MdChevronLeft className="text-text h-6 w-6" />
            </Button>
          </Tooltip>
        </Link>
        <Link href={`/date/${todayDateSlug}`} passHref>
          <Tooltip title="Dagens Dato" arrow TransitionComponent={Zoom}>
            <Button
              component="a"
              variant="contained"
              className="flex-1"
              aria-label="Dagens dato"
            >
              <MdHome className="text-text h-6 w-6" />
            </Button>
          </Tooltip>
        </Link>
        <Tooltip title="Velg Dato" arrow TransitionComponent={Zoom}>
          <Button
            variant="contained"
            className="flex-1"
            aria-label="Velg dato"
            onClick={() => setSelectDateDialog(true)}
          >
            <CgCalendarToday className="text-text h-6 w-6" />
          </Button>
        </Tooltip>
        <Link href={`/date/${nextDateSlug}`} passHref>
          <Tooltip title="Neste Dato" arrow TransitionComponent={Zoom}>
            <Button
              component="a"
              variant="contained"
              className="flex-1"
              aria-label="Neste dato"
            >
              <MdChevronRight className="text-text h-6 w-6" />
            </Button>
          </Tooltip>
        </Link>
      </ButtonGroup>
    </div>
  );
};

export default ButtonBar;
