import React, { Dispatch, useEffect } from "react";
import axios from "axios";

import "./NavMAinComponent.css";

import ILink from "../interfaces/ILink";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { idUniqueV2 } from "id-unique-protocol";
import { getSessionContext } from "../contexts/sessionContext";
import { config, requests } from "../requests/benice_api";

type TUpdatePage = [updatePage: string, setUpdatePage: Dispatch<string>];

interface Props {
  linkList: ILink[];
  updatePageParam: TUpdatePage;
}

const NavMainComponent: React.FC<Props> = ({ linkList, updatePageParam }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updatePage, setUpdatePage] = updatePageParam;
  const [isThereSession, setIsThereSession] = getSessionContext();

  useEffect(() => {
    async function getUserProfilePictureLink(): Promise<void> {
      const { email } = JSON.parse(sessionStorage.getItem("user"));

      if (email) {
        const { baseUrl } = config;
        const url = `${baseUrl}${requests.users.userByEmail(email)}`;

        const token = sessionStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `${token}`;

        const user = await (await axios.get(url)).data;
        const { profile_picture_link } = user["user"];
        sessionStorage.setItem("profile_picture", profile_picture_link);
        setUpdatePage(profile_picture_link);
      } else {
        sessionStorage.setItem("profile_picture", null);
      }
    }

    /**/

    getUserProfilePictureLink();
  });

  function logUserOut() {
    setIsThereSession(false);
    sessionStorage.clear();
  }

  function writeAvatar() {
    const profile_picture = sessionStorage.getItem("profile_picture");

    return (
      <Link to="/users/me" id="avatar_link">
        <Avatar className="profile_avatar" alt="Avatar" src={profile_picture} />
      </Link>
    );
  }

  return (
    <nav className="nav_main">
      <h1>
        <Link to="/users/me">
          <strong style={{ color: "#005ce5" }}>Be Nice</strong>
        </Link>
      </h1>

      {isThereSession ? (
        <div className="right-side-bar">
          <ul>
            {linkList.map((link) => {
              const { title, url } = link;
              return (
                <Link to={url} key={idUniqueV2()} className="link_options">
                  <li className="li_link">{title}</li>
                </Link>
              );
            })}
            {writeAvatar()}
          </ul>
          <Button variant="outlined" color="error" onClick={logUserOut}>
            Sair
          </Button>
        </div>
      ) : (
        <Link to="/users/create">
          <Button variant="contained" color="success">
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
};

export { NavMainComponent };
