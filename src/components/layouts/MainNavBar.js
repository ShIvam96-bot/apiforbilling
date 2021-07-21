import React from "react";
const NavBarItem = ({ label }) => {

  return (
    <li className="nav-item">
      <a
        className="nav-link active"
        href=''
        aria-current="page">
        {label}
      </a>
    </li>

  )
};

const MainNavBar = () => {

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavBarItem
                label="Declarations"
                route={`/`}
              />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

MainNavBar.propTypes = {};

export default MainNavBar;
