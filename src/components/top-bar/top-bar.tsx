import * as React from "react";
import styles from "./top-bar.module.scss";
import {useNavigate } from "react-router-dom";
import {SignInModal} from "../sign-in/sign-in";
import {SignUpModal} from "../sign-up/sign-up";

const logo =
  "src/assets/images/phlogo.png";

export function TopBar() {
  const navigate = useNavigate();

  const handlePlaceholderClick = () => {
    navigate("/");
  };
 
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logo}
          onClick={handlePlaceholderClick}
        />
      </div>
      <div className={styles.center}>
        <a onClick={handlePlaceholderClick} >placeHolder</a>
      </div>
      <div className={styles.right}>
         <SignInModal/>
         <SignUpModal/>
          
      </div>
    </div>
  );
}
