import React, { useContext, useEffect, useState } from "react";
import DeclarationContext from "../../context/declaration/DeclarationContext";
import ConstantsBasedTextInput from './ConstantsBasedTextInput';
import ConstantsBasedPullDownMenu from './ConstantsBasedPullDownMenu';
import validationElements from '../../constants/validation.json';
import MultiLineWithTableElement from "./MultiLineWithTableElement";

const Input = (props) => {
    const { key, onChange, value, element, groupingElement } = props;

    if (groupingElement?.type === 'text') {
        return (
            <ConstantsBasedTextInput
                inputStyle={{ ...groupingElement.inputStyle }}
                key={key}
                onChange={onChange}
                value={value}
                element={element}
            />
        )
    } else if (groupingElement?.type === 'pulldown') {
        return (
            <ConstantsBasedPullDownMenu
                controlled
                inputStyle={{ ...groupingElement.inputStyle }}
                key={key}
                onChange={onChange}
                value={value}
                element={element}
            />
        )
    } else if (groupingElement?.type === 'multiline') {
        return (
            <MultiLineWithTableElement
                element={element}
                onChange={onChange}
                value={value}
            />
        )
    }

    return (
        <></>
    )
};

const InputsSection = (props) => {
    const declarationContext = useContext(DeclarationContext);
    const { declaration } = declarationContext;
    const {
        elements,
        page, section,
        title, styleName,
        actions, childSections,
        itemIndex, columns,
    } = props;

    const [sectionState, setSectionState] = useState({});

    const handleChange = (e) => {
        const { value, name } = e.target;
        let updatedState = {
            ...sectionState,
            [name]: value
        };

        if (typeof itemIndex === 'number') {
            declarationContext.setItemState(itemIndex, section, { ...updatedState });
        } else {
            declarationContext.setDeclaration(updatedState, page, section);
        }

        setSectionState({ ...updatedState })
    };

    /**
     * Since this component can be used in either a regular declaration or a declaration item,
     * if an item index is provided, get the section state from this specific item,
     * otherwise just get the state from the provided declaration page/section.
     */
    useEffect(() => {
        if (typeof itemIndex === 'number') {
            const items = declaration[page]?.declarationItems;
            if (items) {
                setSectionState(items[itemIndex][section] || {});
            }
        } else {
            if (declaration[page]) {
                setSectionState(declaration[page][section]);
            }
        }
    }, [itemIndex, declaration]);

    return (
        <div
            className={`mb-2 p2 ${styleName}`}
            style={{ padding: 8 }}>
            <h6>
                <u>{title}</u>
            </h6>

            <div className='d-flex flex-wrap flex-row'>
                {elements.map((element, index) => {
                    if (element.type === 'row') {
                        return (
                            <div style={{ width: columns ? `${100 / columns}%` : '100%' }}>
                                <div className='d-flex'>
                                    {element.elements.map((element, index) => (
                                        <div style={{ marginRight: 16 }}>
                                            <Input
                                                key={index}
                                                onChange={handleChange}
                                                groupingElement={element}
                                                value={sectionState && (sectionState[element.elementName] || '')}
                                                element={validationElements.filter(
                                                    (tmpElement) => tmpElement.elementName === element.elementName
                                                )[0]}
                                            />
                                        </div>

                                    ))}
                                </div>
                            </div>
                        )
                    };
                    return (
                        <div style={{ width: columns ? `${100 / columns}%` : '100%' }}>

                            <Input
                                key={index}
                                onChange={handleChange}
                                groupingElement={element}
                                value={sectionState && (sectionState[element.elementName] || '')}
                                element={validationElements.filter(
                                    (tmpElement) => tmpElement.elementName === element.elementName
                                )[0]}
                            />
                        </div>
                    )
                })}
            </div>


            <div style={{ marginTop: 16, marginRight: 'auto', width: 'fit-content' }}>
                {actions && actions.map((action, index) => (
                    <button
                        key={index}
                        type='button'
                        className='btn btn-sm btn-primary'>
                        {action.label}
                    </button>
                ))}
            </div>

            {
                childSections?.map((section) => (
                    <InputsSection {...section} />
                ))
            }
        </div >
    )
};

export default InputsSection;