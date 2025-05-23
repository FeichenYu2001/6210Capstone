import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Drawer from './Drawer';
import Typewriter from 'typewriter-effect';
import '../Styles/Applicant/Hero.css';

function ResumeHero(props) {
  const [user, setUser] = useState(props.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // ✅ 如果是公司用户就不去请求 applicant 数据
    if (props.skipApplicantFetch) {
      setIsLoaded(true);
      return;
    }

    axios
      .get("http://localhost:1234/Applicant/" + props.user.aid)
      .then((response) => {
        const data = response.data;
        setUser(data);
        setIsLoaded(true);
      })
      .catch(() => {
        console.error("❌ Error retrieving applicant data");
      });
  }, [props.user, props.skipApplicantFetch]);

  return (
    <div>
      {isLoaded && (
        <div className="ResumeHero">
          <div className="Brand">
            <a
              href={props.isCompany ? "/company-dashboard" : "/Dashboard"}
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 700,
                  fontSize: '36px',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>GetA</span>
                <span style={{ color: '#FFA500' }}>Job</span>
              </h2>
            </a>
          </div>
          <Drawer logout={props.logout} user={user}></Drawer>

          <Typewriter
            onInit={(typewriter) => {
              typewriter.pauseFor(2500).deleteAll().start();
            }}
            options={{
              strings: [
                `Hello <span style="color: #e9896a; font-weight: 900;">${
                  user.name ? user.name.split(' ')[0] : 'there'
                }</span>`,
              ],
              autoStart: true,
              loop: true,
              cursor: '|',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ResumeHero;
