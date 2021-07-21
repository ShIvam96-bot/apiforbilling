import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CustomDatePicker = (props) => {
  const [date, setDate] = useState(new Date());
  const { onChange, element, value, disabled, inputStyle } = props;
  const {
    componentId,
    textDescription,
    elementName,
    styleSheetInfo,
    borderColor,
  } = element;

  const labelProperties = {
    fontSize: "medium",
    fontWeight: "bold",
  };

  const handleChange = (date) => {
    console.log(date);
    setDate(date);
  };

  return (
    <div className='mb-2 mr-2'>
      <div style={{ width: inputStyle?.width || 'fit-content' }}>
        <label
          htmlFor={elementName}
          className="form-label d-flex flex-column justify-content-start"
          style={labelProperties}>
          <span
            className='pb-1'
            style={styleSheetInfo}>
            {textDescription}
          </span>
          <DatePicker
            customInput={<input
              style={{ ...inputStyle }}
              className="d-flex justify-content-start border-4 border-top-0 border-end-0 border-start-0"
            />
            }
            id={elementName}
            selected={date}
            onChange={handleChange}
            locale="en-GB"
          />

        </label>
      </div>
    </div>
  );
};

CustomDatePicker.propTypes = {};

export default CustomDatePicker;
