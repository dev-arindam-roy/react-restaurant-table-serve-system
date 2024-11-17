import React from "react";

const AppHeading = () => {
  return (
    <>
      <h1 className="app-heading">
        <strong>
          {process.env.REACT_APP_APP_NAME}{" "}
          {process.env.REACT_APP_APP_VERSION !== "" &&
            ` - ${process.env.REACT_APP_APP_VERSION}`}
        </strong>
      </h1>
    </>
  );
};

export default AppHeading;
