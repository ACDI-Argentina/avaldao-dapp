import React from 'react';
import PropTypes from 'prop-types';

function AddItemButton(props) {
  const { onClick } = props;
  return (
    <div className="add-milestone-item">
      <button
        type="button"
        className="btn btn-primary btn-sm btn-add-milestone-item"
        onClick={onClick}
      >
        Add Item
      </button>
    </div>
  );
}

AddItemButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddItemButton;