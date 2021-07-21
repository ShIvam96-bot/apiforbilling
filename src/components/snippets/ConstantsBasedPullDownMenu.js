// Use rafcp for the creation of components
import PropTypes from "prop-types";
import {
  MANDATORY_START_ICON,
} from "../../constants/GlobalConstants";
import { useState, useEffect, useContext } from "react";
import DeclarationContext from "../../context/declaration/DeclarationContext";
import journey from "../../constants/journey.json";
import Select from 'react-select';
const ConstantsBasedPullDownMenu = (props) => {
  const declarationContext = useContext(DeclarationContext);
  const [listItems, setListItems] = useState([]);
  const {
    componentId,
    pullDownMenu,
    elementName,
    isMandatory,
    textDescription,
    parenthesisCode,
    borderColor,
    furtherInformartionLink,
  } = props.element;

  !pullDownMenu && console.log("missing elementName: " + elementName);

  // Create custom on change provided this function has been passed via props
  // should always be passwed but at the moment it has not been updated in all places
  // so we need an IF condition. After that we should have PropTypes enforcing this.
  const onElementChange = (e) => {
    console.log(e);
    // console.log(e);
    if (props.onChange != null) {
      props.onChange({
        target: {
          name: elementName,
          value: e.value
        }
      });
    }
  };

  // Stylesheet properties
  const labelProperties = {
    fontSize: "small",
    fontWeight: "bold",
  };

  const urlProperties = {
    fontSize: "small",
  };

  // Recursively loop through nested objects in the DeclarationState to find the value of a provided key
  const findValueInContext = (selectedKey) => {
    let value = null;
    const findValue = (object) => {
      Object.keys(object).forEach((key) => {
        if (typeof object[key] === "object") {
          findValue(object[key]);
        } else {
          if (key === selectedKey) {
            value = object[key];
          }
        }
      });
    };

    findValue(declarationContext);
    return value;
  };


  /**
   * Extract pulldown menu items from the validation element, and if the element is found and matches
   * ones of the conditions in journey JSON, filter the menu items accordingly.
   */
  useEffect(() => {
    if (!pullDownMenu) return;
    let filteredMenu = [...pullDownMenu];

    let journeyValue = journey.filter(
      (element) => element.elementName === elementName
    )[0]?.value;
    if (journeyValue) {
      journeyValue.forEach((condition) => {
        let matchedConditions = 0; // number of conditions that in within the condition.if array

        condition.if?.forEach((object) => {
          const key = Object.keys(object)[0];
          // find the value of the condition key in context and check if it's included in the journey array
          if (object[key].includes(findValueInContext(key))) {
            matchedConditions = matchedConditions + 1;
          }
        });

        // if all conditions match, set the filteredMenu to be the values in condition.
        if (matchedConditions === condition.if.length) {
          filteredMenu = condition.then;
        }
      });
    }

    const listItems = filteredMenu ? (
      filteredMenu.map((option) => ({
        label: option.value, value: option.key,
        disabled: option.key === 'DEFAULT'
      }))
    ) : [];

    setListItems([...listItems]);
  }, [declarationContext]);

  return (
    <div className="mb-2">
      <label
        htmlFor={elementName}
        className="form-label d-flex justify-content-start"
        style={labelProperties}
      >
        {isMandatory ? MANDATORY_START_ICON : " "}
        {" ID: "}
        {componentId}
        {" - "}
        <span className='yellow-stylesheet-default'>{parenthesisCode}</span>
        {" - "}
        <span className='red-stylesheet-default'>{textDescription}</span>
      </label>
      <div
        style={{ width: '75%', ...props.inputStyle }}
      >
        <Select
          className={borderColor + `${elementName}`}
          value={listItems?.filter((item) => item.value === (props.value || 'DEFAULT'))}
          onChange={onElementChange}
          options={listItems}
          isOptionDisabled={(option) => option.disabled}
        />
      </div>

      {furtherInformartionLink?.length > 0 && (
        <div
          id={elementName}
          className="form-text d-flex justify-content-start "
          style={urlProperties}
        >
          For more information check:{" "}
          <a href={furtherInformartionLink} target="_blank" rel="noreferrer">
            {furtherInformartionLink}{" "}
          </a>
        </div>
      )}
    </div>
  );
};

// @todo
ConstantsBasedPullDownMenu.propTypes = {
  labelProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
  urlProperties: PropTypes.shape({
    fontSize: PropTypes.string.isRequired,
  }),
  YELLOW_STYLESHEET_COLOUR: PropTypes.shape({
    color: PropTypes.string.isRequired,
    textAlign: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
  RED_STYLESHEET_COLOUR: PropTypes.shape({
    color: PropTypes.string.isRequired,
    textAlign: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
  }),
};

export default ConstantsBasedPullDownMenu;
