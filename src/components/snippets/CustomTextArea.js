// Use rafcp for the creation of components
import React from "react";
import PropTypes from "prop-types";

const CustomTextArea = (props) => {
  const {
    componentId,
    textDescription,
    elementName,
    styleSheetInfo,
    borderColor,
    furtherInformartionLink,
    rows,
  } = props.element;

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
    <div className="mb-2 mr-2 ">
      <label
        htmlFor={elementName}
        className="form-label d-flex justify-content-start"
        style={labelProperties}
      >
        <span style={styleSheetInfo}>{textDescription}</span>
      </label>
      <textarea
        className={"form-control  " + borderColor}
        id={componentId}
        onChange={onElementChange}
        name={elementName}
        rows={rows}
      ></textarea>
      {furtherInformartionLink.length > 0 && (
        <div
          id={elementName}
          className="form-text d-flex justify-content-start "
          style={urlProperties}
        >
          For more information check:{" "}
          <a href={furtherInformartionLink} target="_blank">
            {furtherInformartionLink}{" "}
          </a>
        </div>
      )}
    </div>
  );
};

CustomTextArea.propTypes = {
  labelProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
  urlProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
  }),
};

export default CustomTextArea;
