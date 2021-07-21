import React from "react";
import DeclarationEntry from "../pages/DeclarationEntry";
import MainNavBar from "./MainNavBar";

const CoreLayout = () => {

  return (
    <div>
      <MainNavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col col-12">
            <DeclarationEntry
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoreLayout;
