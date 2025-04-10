// CircularProgress.js
import React from 'react';
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";
import "../Styles/Applicant/CircularProgress.css";

function CircularProgress({ completeness }) {
  return (
    <div className="completeness pt-5">
      <div className="pb-3">
        <h5>Profile Completeness</h5>
        <p>Improve your profile to reach 100%!</p>
      </div>
      <div className="circularprogress">
        <CircularProgressbar
          value={completeness}
          text={`${completeness}%`}
          strokeWidth={20}
          background
          backgroundPadding={7}
          styles={buildStyles({
            strokeLinecap: "butt",
            textColor: "#777",
            pathColor: "#e9896a",
            trailColor: "white",
            textSize: "14px",
            backgroundColor: "#fff",
            rotation: 0.25
          })}
        />
      </div>
    </div>
  );
}

export default CircularProgress;
