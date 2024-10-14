export default Dashboard;
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import icon from "../img/user.png";

const Dashboard = ({ auth: { user } }) => {
  return (
    <div style={{ marginTop: "5rem", textAlign: "center" }}>
      <h1>Welcome, {user && user.name}!</h1>
      <img
        src={icon}
        alt="user-icon"
        style={{ width: "150px", margin: "20px auto" }}
      />

      {/* Display dashboard features */}
      <div className="dashboard-features">
        <h2>Rishika Mehta</h2>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

connect(mapStateToProps)(Dashboard);
