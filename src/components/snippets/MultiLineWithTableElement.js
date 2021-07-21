// Use rafcp for the creation of components - rce is the one used un Ubuntu, rconst for a constructor
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConstantsBasedPullDownMenu from "./ConstantsBasedPullDownMenu";
import ConstantsBasedTextInput from "./ConstantsBasedTextInput";
import elements from "../../constants/validation.json";
import csv from 'csvtojson';
/* 
Should contain a TABLE with EDIT & DELETE buttons plus an ARRAY where the JSON information would be collected
on SUBMIT. The trick would be to allow for the component to dynamically be able to view or edit items based
on whether they are an ARRAY (i.e. PULL DOWN menu) or whether they are an ITEM. We can still use elementName
as the construcor for this and can have an iterator as the JSON elements will all be within a CONSTANT JSON
as this example demonstrates
[{
    elementName: "",
    type: "INPUT | PULLDOWN",
}]
The element names will need to be displayed and represented separatelly in the CONSTANTS as normal.
The table would be produced based on the same elements based on a name,value pair arrays.
There will be a max limit of 6 components at the moment as they all go into one of the button groups
*/

const readFile = (file, cb) => {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const allText = rawFile.responseText;
        cb(allText);
      }
    }
  }
  rawFile.send(null);
}

const MultiLineWithTableElement = (props) => {
  const { onChange: onChangeProp, value: valueProp } = props;
  const { components, elementName, limit, label } = props.element;
  // Get the array of corresponding element names or null if empty
  const arrayItems = components.length > 0 ? components : null;

  // All values of element inputs
  const [inputValues, setInputValues] = useState([]);
  // Array of table items
  const [items, setItems] = useState([]);

  // filteredItems are items filtered with searchValue
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  // Currently modifable table item, -1 means no item is being edited
  const [modify, setModify] = useState(-1);
  const [selectedPage, setSelectedPage] = useState(0);

  // Add the on submit functionality if needed
  const columnNames = () => {
    return arrayItems.map(
      (item) =>
        elements.filter(
          (tmpElement) => tmpElement.elementName === item.elementName
        )[0]?.textDescription
    );
  };

  // Add the on submit functionality if needed
  const elementNames = () => {
    return arrayItems.map(
      (item) =>
        elements.filter(
          (tmpElement) => tmpElement.elementName === item.elementName
        )[0].elementName
    );
  };


  // Add the onChange functionality for the main form elements to create the CURRENT JSON element
  const onChange = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value
    });
  };

  const addRow = () => {
    updateItems([...items, inputValues]);
    setInputValues({})

    // Select the page to which this new item has been added
    setSelectedPage(Math.floor(items.length / 10));
  };

  // Remove a row from the ITEMS array
  const deleteRow = (e) => {
    updateItems(items.filter((item, index) => index != e.target.id));
  };

  const editRow = (e) => {
    const { id } = e.target;
    setModify(id);

    // Set the input values to match the selected row's values
    items.forEach((item, index) => {
      if (parseInt(id) === index) {
        setInputValues({ ...item })
      }
    })
  };

  // Reset the input fields for all of the elements
  // Set the text input values to blank, and the pull down values to the first entry
  const resetRow = () => {
    setInputValues({})
  };

  const modifyRow = () => {
    items.forEach((item, index) => {
      if (index === parseInt(modify)) {
        items[index] = { ...item[index], ...inputValues };
      };
    });;

    updateItems(items);
    setInputValues({});
    setModify(-1)
  };

  const handleCancel = () => {
    setInputValues({})
    setModify(-1);
  };

  const handleExportClick = async () => {

    const json = JSON.stringify(items);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = href;
    link.download = elementName + ".json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportFileChange = (e) => {
    Array.from(e.target.files).forEach((file) => {
      // Create temporary file path
      const filePath = URL.createObjectURL(file);
      const { type } = file;

      readFile(filePath, (fileValue) => {
        if (type === 'application/json') {
          const parsedJson = JSON.parse(fileValue);
          if (Array.isArray(parsedJson)) {
            setItemsFromJson(parsedJson);
          }
        } else if (type.includes('text/')) {
          csv({ output: "json" }).fromString(fileValue)
            .then((jsonResult) => {
              setItemsFromJson(jsonResult);
            })
        }
      });
    })
  };

  const setItemsFromJson = (dataArray) => {
    let newTableItems = [];

    dataArray.forEach((item) => {
      let tableItem = {};

      // Grab the relevant element data from the JSON item
      arrayItems.forEach((element) => {
        tableItem[element.elementName] = item[element.elementName];
      });

      // Add the table item only if it at least has 1 element value
      if (Object.keys(tableItem).length > 0) {
        newTableItems.push(tableItem);
      };
    });

    updateItems([...items, ...newTableItems]);
  };

  const mapTableElements = (item) => {
    let tableItems = [];

    elementNames().map((tmpItem) => {
      const validationElement = elements.filter(
        (tmpElement) => tmpElement.elementName === tmpItem
      )[0];


      tableItems.push(
        <td style={{ maxWidth: 200 }}>
          {/* If element is of type pulldown, show the value of the option instead of key */}
          {validationElement?.pullDownMenu ?
            validationElement.pullDownMenu.filter((option) => option.key === item[tmpItem])[0]?.value
            : item[tmpItem]}
        </td>
      );
    });

    return tableItems;
  };

  const updateItems = (items) => {
    onChangeProp({ target: { value: items, name: elementName } });
  }

  useEffect(() => {
    if (!valueProp) return;
    setItems([...valueProp]);
  }, [valueProp]);

  useEffect(() => {
    let filteredItems = [];

    if (searchValue) {
      items.forEach((item) => {
        let matches = false;

        Object.keys(item).forEach((key) => {
          if (String(item[key])?.toLowerCase().includes(searchValue)) {
            matches = true;
          }
        });

        if (matches) {
          filteredItems.push(item);
        }
      });
    } else {
      filteredItems = [...items];
    };

    setFilteredItems([...filteredItems]);
  }, [items, searchValue]);

  /*
    Iterate through the array and build the components within a coloured box
      no additional validation will be build on this, for example, if no INPUT or PULLDOWN is provided, 
      the code at the moment crashes
    Added a thin bottom line at the end of the EDIT section that could be coloured at a later stage
    The advanced logic is not in the construction of the elements but in the position of the elements on the 
      TABLE structure and the JSON creation based on the buttons
    */

  return (
    <div style={{ paddingTop: 12 }} className={`${elementName}`}>
      <h6>
        <u>{label}</u>
      </h6>

      <div className='border-bottom border-primary'>

        <div className="d-flex flex-row justify-content-center align-items-center p-2">
          <div className='d-flex flex-row align-items-center'>
            <div className="d-flex flex-row flex-wrap"
              style={{ marginTop: -10, marginBottom: 8 }}>
              {/* Table Elements */}
              {arrayItems.map((item) => (
                <div style={{ marginRight: 12, width: 250 }}>
                  {item.type === "text" ? (
                    <ConstantsBasedTextInput
                      inputStyle={{ width: '100%' }}
                      element={
                        elements.filter(
                          (tmpElement) =>
                            tmpElement.elementName === item.elementName
                        )[0]
                      }
                      value={inputValues[item.elementName] || ''}
                      onChange={onChange}
                    />
                  ) : (
                    <ConstantsBasedPullDownMenu
                      inputStyle={{ width: '100%' }}

                      element={
                        elements.filter(
                          (tmpElement) =>
                            tmpElement.elementName === item.elementName
                        )[0]
                      }
                      value={inputValues[item.elementName] || ''}
                      onChange={onChange}
                    />
                  )}
                </div>
              )
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ paddingBottom: 16 }} >
          {modify > -1 && (
            <>
              <button
                style={{ marginRight: 8, width: 100 }}
                className="btn btn-sm btn-success"
                onClick={modifyRow}>
                Modify
              </button>

              <button
                style={{ marginRight: 8, width: 100 }}
                className="btn btn-sm btn-danger"
                onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}

          {/* Action Buttons */}
          {modify <= -1 && (
            <>
              <button
                style={{ marginRight: 8, width: 100 }}
                className="btn btn-sm btn-success"
                disabled={items.length === limit}
                onClick={addRow}>
                Add
            </button>

              <button
                style={{ width: 100 }}
                className="btn btn-sm btn-danger"
                onClick={resetRow}>
                Reset
            </button>
            </>
          )}
        </div>
      </div>

      {/* Import & Export Buttons */}
      <div className="d-flex flex-row justify-content-center align-items-center p-2">
        <div>

          <label
            htmlFor={`${elementName}-search`}
            className="form-label d-flex justify-content-start">
            <span style={{ fontSize: 12, fontWeight: 700 }}>Search</span>
          </label>
          <input
            id={`${elementName}-search`}
            type="text"
            value={searchValue}
            className="form-control-sm d-flex justify-content-start border-4 border-top-0 border-end-0 border-start-0"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div style={{ width: 'fit-content', marginLeft: 'auto' }}>
          <button
            style={{ marginRight: 8 }}
            onClick={() => document.getElementById(`import-${elementName}`).click()}
            className="btn btn-sm btn-success">
            Import
          </button>

          <input
            id={`import-${elementName}`}
            onChange={handleImportFileChange}
            type="file"
            style={{ display: "none" }}
          />

          <button
            className="btn btn-sm btn-danger"
            onClick={handleExportClick}>
            Export
          </button>
        </div>
      </div>
      <div className="row p-2 ">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              {columnNames().map((item, index) => (
                <th scope="col" key={index}>
                  {item}
                </th>
              ))}
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item, index) => {
              if (index >= (selectedPage * 10) && index + 1 <= ((selectedPage + 1) * 10)) return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  {mapTableElements(item)}
                  <td>

                    <button
                      id={index} onClick={editRow}
                      style={{ marginRight: 12 }}
                      className="btn btn-sm btn-success ml-2">
                      Edit
                    </button>
                    <button
                      id={index} onClick={deleteRow}
                      className="btn btn-sm btn-danger ml-2">
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {items.length === 0 &&
          <div style={{ textAlign: 'center', padding: 12 }}>
            No items yet
          </div>
        }

        {/* Pagination Elements */}
        {filteredItems.length > 10 &&
          <div style={{ width: 'fit-content', margin: '12px auto 0px auto' }}>
            <nav>
              <ul className="pagination">

                {/* Decrement the selected page by 1 until 0 is reached */}
                <li
                  onClick={() => setSelectedPage(selectedPage > 0 ? selectedPage - 1 : 0)}
                  className="page-item">
                  <div className="page-link">Previous</div>
                </li>
                <li
                  onClick={() => setSelectedPage(0)}
                  className="page-item">
                  <div
                    className="page-link"
                    style={{ backgroundColor: selectedPage === 0 ? '#e9ecef' : '' }}
                  >{1}</div>
                </li>

                {/* Get the number of pages by dividing the items array length by 10 */}
                {/* Should appear only when the table has more than 10 elements */}
                {[...Array(Math.floor(filteredItems.length / 10)).keys()].map((page) => (
                  <li
                    onClick={() => setSelectedPage(page + 1)}
                    className="page-item">
                    <div
                      style={{ backgroundColor: selectedPage === page + 1 ? '#e9ecef' : '' }}
                      className="page-link">{page + 2}
                    </div>
                  </li>
                ))}
                {/* Increment selected page by 1 until the highest page is recahed */}
                <li
                  onClick={() => setSelectedPage(
                    selectedPage < Math.floor(filteredItems.length / 10) ?
                      selectedPage + 1 : Math.floor(filteredItems.length / 10)
                  )}
                  className="page-item">
                  <div className="page-link">Next</div>
                </li>
              </ul>
            </nav>
          </div>
        }
      </div>
    </div >
  );
};

MultiLineWithTableElement.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default MultiLineWithTableElement;
