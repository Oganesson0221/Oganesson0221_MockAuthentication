import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import icon from "../img/user.png"; // Replace with the path to your image
import "./Dashboard.css";

const Dashboard = ({ auth: { user } }) => {
  return (
    <div className="dashboard-container">
      <div className="profile-card">
        <h1 className="welcome-text">Welcome, {user && user.name}!</h1>
        <div className="profile-image">
          <img src={icon} alt="user-icon" />
        </div>
        <div className="dashboard-features">
          <h2>Rishika Mehta</h2>
          <div className="social-links-section section">
            <h3>Links to my GitHub and LinkedIn profile</h3>
            <p>
              <a
                href="https://github.com/Oganesson0221"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/rishika-mehta-a7919022a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
          </div>
          <p className="description">
            I am a driven Data Science and Artificial Intelligence undergraduate
            at NTU with a strong passion for technology, leadership, and
            community engagement. I have been involved in various technical and
            leadership roles, including developing AI solutions, organizing
            tech-related events, and leading teams across different student
            organizations. My skills include programming, machine learning, deep
            learning, and project management. I am also enthusiastic about
            sustainability and social impact, having worked on multiple
            community-driven initiatives.
          </p>
        </div>

        <div className="skills-section section">
          <h3>Computer Skills</h3>
          <p>
            MS-Excel, MS-Access, MS-Word, Web development (MERN stack), Python,
            Flask, C, Java, C++, JavaScript, HTML, CSS, Data Structures and
            Algorithms, Object-Oriented Design and Programming
          </p>
          <h3>Skills</h3>
          <p>
            Research and Analysis, Coding, Commercial understanding, Critical
            thinking, Adaptability, Project Management, Communication, Teamwork
          </p>
        </div>

        <div className="projects-section section">
          <h3>Academic Projects & Achievements</h3>
          <ul className="achievements-list">
            <li>
              Software development projects using MERN stack (Expense tracker,
              currency converter based on real-time exchange rates, and an AI
              response generator)
            </li>
            <li>
              Developed a machine learning model using convolutional neural
              networks (CNNs), KNN, Random Forest Classifiers, and Naive Bayes
              to classify skin diseases
            </li>
            <li>
              Built a Food Ordering Management System using Java, demonstrating
              the concepts of Object-Oriented Design and Programming
            </li>
            <li>
              Authored a research article on ‘Advancing Economic Growth
              Prediction: A Study of Multilayer Perceptron, Adaptive Neuro-Fuzzy
              Inference System, and Gene Expression Programming’, published in
              Ecolloquial 2024 Edition
            </li>
            <li>
              Co-authored the research article on ‘Deep analysis into the
              sugarcane price policy of India’, published in Ecolloquial 2023
              edition
            </li>
            <li>
              Completed a course on ‘Data Structures and Algorithms’ in 2024
            </li>
          </ul>
        </div>
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

export default connect(mapStateToProps)(Dashboard);
