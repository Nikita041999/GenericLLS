import React from "react";
import { getGoogleUrl } from "../../utils/getGoogleUrl";
import { getGitHubUrl } from "../../utils/getGithubUrl";
import GoogleLogo from "../../assets/images/google.svg";
import GitHubLogo from "../../assets/images/github.svg";
import styles from "./LoginPlayer.module.css";

const GlobalLoginButtons = (propButtons) => {
  const {
    handleGithubLogin,
    handleGoogleLogin,
    handleLinkedInLogin,
    handleTwitterLogin,
    handleFacebookLogin,
  } = propButtons;
  return (
    <div className={styles.global_links}>
      <a
        style={{ backgroundColor: "#3b5998" }}
        // href={getGoogleUrl()}
        href=""
        onClick={handleGoogleLogin}
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
      >
        <img
          className="pr-2"
          src={GoogleLogo}
          alt=""
          style={{ height: "2rem" }}
        />
        Continue with Google
      </a>
      <a
        style={{ backgroundColor: "#55acee" }}
        href=""
        // href={getGitHubUrl()}
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        onClick={handleGithubLogin}
      >
        <img
          className="pr-2"
          src={GitHubLogo}
          alt=""
          style={{ height: "2.2rem" }}
        />
        Continue with GitHub
      </a>
      <a
        style={{ backgroundColor: "#3b5998" }}
        // href={getGoogleUrl()}
        href=""
        onClick={handleLinkedInLogin}
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
      >
        {/* <img
          className="pr-2"
          src={}
          alt=""
          style={{ height: "2rem" }}
        /> */}
        Continue with LinkedIn
      </a>
      <a
        style={{ backgroundColor: "#3b5998" }}
        // href={getGoogleUrl()}
        href=""
        onClick={handleFacebookLogin}
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
      >
        {/* <img
          className="pr-2"
          src={}
          alt=""
          style={{ height: "2rem" }}
        /> */}
        Continue with Facebook
      </a>
      <a
        style={{ backgroundColor: "#3b5998" }}
        // href={getGoogleUrl()}
        href=""
        onClick={handleTwitterLogin}
        role="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
      >
        {/* <img
          className="pr-2"
          src={}
          alt=""
          style={{ height: "2rem" }}
        /> */}
        Continue with Twitter
      </a>
    </div>
  );
};

export default GlobalLoginButtons;
