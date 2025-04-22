import React, { useEffect, useState } from 'react';
import { FaBars } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Drawer } from 'rsuite';
import { Divider } from 'rsuite';
import SideNav from './SideNav';

import 'rsuite/dist/styles/rsuite-default.css';

function DrawerComponent(props) {
  const [show, setShow] = useState(false);
  const user = props.user || {};

  const Toggle = () => {
    setShow(true);
  };
  const Close = () => {
    setShow(false);
  };

  const isApplicant = user?.address !== undefined;

  return (
    <div>
      <button onClick={Toggle} className="draweropen">
        <h6>{user.username || user.name}<span className="ml-3"><FaBars size={24} /></span></h6>
      </button>
      <Drawer size="xs" placement="right" backdrop={true} show={show} onHide={Close} className="MyDrawer">
        <Drawer.Header>
          <Drawer.Title>GetAJob</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="drawerheader">
            {user.image && <img src={user.image} className="imgdrawer" alt="avatar" />}
            <p style={{ color: "#aaa", fontWeight: "bold", fontSize: "18px" }}>
              {(user.name || '').toUpperCase()}
            </p>

            {/* 仅 applicant 显示当前职位和地址 */}
            {isApplicant && user.currentJob && (
              <p style={{ color: "#aaa" }}>
                <span style={{ color: "#e9896a" }}>{user.currentJob} </span>
                at {user.currentCompany}
              </p>
            )}
            {user.email && <p>{user.email}</p>}
            {isApplicant && user.address?.city && (
              <p><IoLocationOutline /> {user.address.city}, {user.address.country}</p>
            )}
          </div>
          <Divider />
          <SideNav logout={props.logout}></SideNav>
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

export default DrawerComponent;
