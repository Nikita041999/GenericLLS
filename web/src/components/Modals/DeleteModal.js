import cancelIcon from "assets/images/cancelIcon.svg";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function DeleteModal({
  showModal,
  data,
  handleToggleDeleteModal,
  handleDelete,
  module = "User",
  setDeleteId
}) {
  const handleClose = () => {
    handleToggleDeleteModal(false);
    setDeleteId(0)
  };

  // console.log("data", data);
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      id="exampleModal"
      className="info_modal"
    >
      <div className="modal-body text-center">
        {/* <div className="text-center mb-4">
          <img src={cancelIcon} width="50" alt="delete" />
        </div> */}
        {/* <h3>Delete {module}</h3> */}
        <p className="mb-4">
          Are you sure you want to delete this {module.toLocaleLowerCase()}?
        </p>
        <button
          type="button"
          className="btn btn-default"
          data-bs-dismiss="modal"
          onClick={handleClose}
        >
          Cancel
        </button>
        &nbsp;&nbsp;
        <button
          type="button"
          className="btn btn-primary deletethis"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
