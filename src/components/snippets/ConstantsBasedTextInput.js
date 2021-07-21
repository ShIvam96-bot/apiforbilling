// Use rafcp for the creation of components
import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

const CustomTextInput = (props) => {
  const [inputValue, setInputValue] = useState('');
  const {
    element, value,
    onChange, inputStyle,
    disabled
  } = props;

  const {
    componentId,
    textDescription,
    elementName,
    styleSheetInfo,
    borderColor,
    readOnly,
    furtherInformartionLink,
  } = element || {};

  // Stylesheet properties
  const labelProperties = {
    fontSize: "small",
    fontWeight: "bold",
  };

  const urlProperties = {
    fontSize: "small",
  };

  const debouncedUpdate = useCallback(
    debounce((e) => {
      onChange && onChange(e);
    }, 300),
    [componentId, onChange]
  );

  /**
   * Changing the selected input value after debounce it for 0.3s and set it to the state
   */
  const handleInputChange = (e) => {
    const { value } = e.target;
    if (onChange != null) {
      debouncedUpdate(e);
      setInputValue(value);
    }
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="mb-2 mr-2">
      <label
        htmlFor={elementName}
        className="form-label d-flex justify-content-start"
        style={labelProperties}>
        <span style={styleSheetInfo}>{textDescription}</span>
      </label>
      <input
        disabled={disabled}
        type="text"
        readOnly={readOnly}
        value={inputValue}
        id={componentId}
        style={{ ...inputStyle }}
        name={elementName}
        className={
          `${elementName}` +
          " form-control-sm d-flex justify-content-start border-4 border-top-0 border-end-0 border-start-0 " +
          borderColor
        }
        onChange={handleInputChange}
      />
      {furtherInformartionLink?.length > 0 && (
        <div
          id={elementName}
          className="form-text d-flex justify-content-start "
          style={urlProperties}
        >
          For more information check:{" "}
          <a href={furtherInformartionLink} rel="noreferrer" target="_blank">
            {furtherInformartionLink}{" "}
          </a>
        </div>
      )}
    </div>
  );
};

CustomTextInput.propTypes = {
  labelProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
  urlProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
  }),
};

export default CustomTextInput;
