import React, { useEffect, useState } from "react";
import DeclarationPage01 from "./DeclarationPage01";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const DeclarationEntry = (props) => {
  const [key, setKey] = useState("tab1");

  return (
    <div>
      <Tabs
        id="declarationFormTabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}>
        <Tab eventKey="tab1" title="TAB1">
          <p></p>
          <DeclarationPage01 />
        </Tab>
      </Tabs>
    </div>
  );
};

DeclarationEntry.propTypes = {};

export default DeclarationEntry;
