// Use rafcp for the creation of components
import React from "react";
import PropTypes from "prop-types";

const CustomRange = (props) => {
  const {
    componentId,
    textDescription,
    elementName,
    styleSheetInfo,
    borderColor,
    furtherInformartionLink,
    minValue,
    maxValue,
    step,
    type,
  } = props.element;

  /* props.value will keep the value of the element
    Set it to a fixed value for now equal to XYZ
   */
  if (props.value) console.log(props.value);

  // Stylesheet properties
  const labelProperties = {
    fontSize: "medium",
    fontWeight: "bold",
  };

  const urlProperties = {
    fontSize: "small",
  };

  // Create custom on change provided this function has been passed via props
  // should always be passwed but at the moment it has not been updated in all places
  // so we need an IF condition. After that we should have PropTypes enforcing this.
  const onElementChange = (e) => {
    // console.log(e);
    if (props.onChange != null) {
      props.onChange(e);
    }
  };

  return (
    <div className="mb-2 mr-2">
      <label
        htmlFor={elementName}
        className="form-label d-flex justify-content-start"
        style={labelProperties}
      >
        <span style={styleSheetInfo}>{textDescription}</span>
      </label>
      <input
        type="range"
        id={componentId}
        name={elementName}
        min={minValue}
        max={maxValue}
        step={step}
        className={
          "form-control-sm d-flex justify-content-start border-4 border-top-0 border-end-0 border-start-0 " +
          borderColor
        }
        onChange={onElementChange}
        value={props.value}
      />
      {furtherInformartionLink.length > 0 && (
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

CustomRange.propTypes = {
  labelProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
  urlProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
  }),
};

export default CustomRange;
