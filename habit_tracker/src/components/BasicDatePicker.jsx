import React, { Fragment, useState } from "react";
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider, InlineDatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

function BasicDatePicker(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Fragment>
      <DatePicker
        disableFuture
        openTo="year"
        format="dd/MM/yyyy"
        label="Date of birth"
        views={["year", "month", "date"]}
        value={selectedDate}
        onChange={handleDateChange}
      />
    </Fragment>
  );
}

export default BasicDatePicker;
