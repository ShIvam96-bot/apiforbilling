// Add state and dispatch
import React, { useReducer } from "react";
import DeclarationContext from "./DeclarationContext";
import declarationReducer from "./DeclarationReducer";
import { SET_DECLARATION, SET_ITEM_STATE } from "../types";

// Create the declaration state and populate it with some dumy initial contacts for the testing
// current element is an UI/UX EXAMPLE - will need to be a null element when we initiate it with the APIs
// but will hold the object that would need to be manipulated.

export const initialState = {
  declaration: {
    declarationMainData: {
      declarationType: "",
      declarationId: "",
      additionalDeclarationType: "",
      totalNoOfItems: "",
      registrationNationalityCode: "",
      borderTransportMeans: "",
      ucrReferenceNumber: "",
    },
    holderOfAuthIdent: {
      holderOfAuthorisationIdentificationId: "",
      holderOfAuthorisationIdentificationTypeCode: "",
    },
  },
};
const DeclarationState = (props) => {


  // state allows us to access anything in the state and dispatch allows dispatching objects to the reducer
  // populate the declarationReducer with the initial state to instantiate it
  const [state, dispatch] = useReducer(declarationReducer, initialState);

  // Set State
  const setDeclaration = (current, page, section) => {
    dispatch({
      type: SET_DECLARATION,
      payload: {
        current,
        page,
        section
      },
    });
  };

  const setItemState = (itemIndex, section, data) => {
    dispatch({
      type: SET_ITEM_STATE,
      payload: {
        itemIndex,
        section,
        data
      }
    })
  };

  // Return provider to wrap the whole application with the CONTEXT  state has been provided by the reducer
  // IMPORTANT:: -> Need to be adding both the State.XYZ elements AND the functions as they are being created
  return (
    <DeclarationContext.Provider
      value={{
        declaration: state,
        setDeclaration,
        setItemState
      }}
    >
      {props.children}
    </DeclarationContext.Provider>
  );
};

export default DeclarationState;
