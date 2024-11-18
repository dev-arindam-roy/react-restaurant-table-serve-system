import React from "react";
import Select, { createFilter } from "react-select";

const SelectDropDown = ({
  options,
  placeholder = "Select Option",
  isSearchable = true,
  isClearable = true,
  noOptionsMessage = () => "No options found",
  filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    matchFrom: "any",
    stringify: (option) => option.label,
  },
  ...rest
}) => {
  return (
    <>
      <Select
        options={options}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        noOptionsMessage={noOptionsMessage}
        filterOption={createFilter(filterConfig)}
        {...rest}
      />
    </>
  );
};

export default SelectDropDown;
