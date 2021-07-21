import React from "react";
import PropTypes from "prop-types";
import DeclarationContext from "../../context/declaration/DeclarationContext";
import grouping from '../../constants/declarations-grouping.json';
import { useContext } from "react";
import InputsSection from "../snippets/InputsSection";

const DeclarationPage01 = () => {
  const declarationContext = useContext(DeclarationContext);
  return (
    <div className='container'>
      <div className='d-flex flex-row flex-wrap'>
        {grouping.declaration.sections.map((section, index) => (
          // Split sections with index to be separated into the columns using indices
          <div style={{
            width: section.fullWidth ? '100%' : '50%',
          }}>
            <div style={{ marginLeft: 8, marginRight: 8 }}>
              <InputsSection
                key={index}
                page='declaration'
                {...section}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeclarationPage01;
