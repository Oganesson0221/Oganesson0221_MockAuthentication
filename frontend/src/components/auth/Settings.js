// src/components/auth/Settings.js
import React, { useState } from "react";
import { connect } from "react-redux";
import { changePassword } from "../../actions/auth"; // Import changePassword action
import PropTypes from "prop-types";
import "./Settings.css";

const Settings = ({ changePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const onSubmit = (e) => {
    e.preventDefault();

    // Attempt to change the password and handle success or error
    changePassword(currentPassword, newPassword)
      .then((res) => {
        // If password change is successful, clear form and set success message
        setCurrentPassword("");
        setNewPassword("");
        setSuccessMessage("Password changed successfully");
        setErrorMessage(""); // Clear any previous errors
      })
      .catch((err) => {
        // If an error occurs, set the error message
        setErrorMessage(
          "Cannot change the password, please enter the correct current password."
        );
        setSuccessMessage(""); // Clear any previous success messages
      });
  };

  return (
    <div className="settings">
      <h1>Change Password</h1>

      {/* Display success message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {/* Display error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={onSubmit}>
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

Settings.propTypes = {
  changePassword: PropTypes.func.isRequired,
};

export default connect(null, { changePassword })(Settings);
