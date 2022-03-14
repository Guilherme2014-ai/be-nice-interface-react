/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Dependencias
import React, { Dispatch, useState } from "react";
import axios from "axios";

// Config
import { config, requests } from "../requests/benice_api";
const { baseUrl } = config;

// Components
import EditIcon from "@mui/icons-material/Edit";
import { Button, ButtonGroup, TextField } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Modules
import AlertMessageFactory from "../factory/AlertMessageFactory";

// Context
import { getAlertContext } from "../contexts/alertContext";

// Interfaces
interface IProps {
  userOwner: boolean;
  isThereInvitationRequest: boolean;
  userDataParseToJson: any;
  updatePageParam: TUpdatePage;
}
import IAlertMessage from "../interfaces/IAlertMessage";
type AlertStateParam = [IAlertMessage, Dispatch<any>];
type TUpdatePage = [updatePage: string, setUpdatePage: Dispatch<string>];

// CSS
import "./InfoAreaComponent.css";

const InfoAreaComponent: React.FC<IProps> = ({
  userOwner,
  isThereInvitationRequest,
  userDataParseToJson,
  updatePageParam,
}) => {
  const [updatePage, setUpdatePage] = updatePageParam;
  const [alertMessage, setAlertMessage]: AlertStateParam = getAlertContext();

  const [sendComplimentFieldValue, setSendComplimentFieldValue] = useState("");
  const [sendRequestFIeld, setSendRequestFIeld] = useState("");

  async function profilePictureUpdateHandler() {
    const newProfilePictureLink = prompt("Link da nova Imagem:");

    if (newProfilePictureLink && newProfilePictureLink.length > 0) {
      try {
        // Altera no dbs
        await axios.put(`${baseUrl}${requests.users.profile_pictureEdit}`, {
          profile_picture_link: newProfilePictureLink,
        });

        setUpdatePage("Naruto Uzumaki");
      } catch (e) {
        console.log("deu errado bixo.");
      }
    }
  }
  async function requestHandler(action) {
    const { accept_invite, deny_invite } = requests.users;

    const userEmail = userDataParseToJson.email;

    const actionUrl =
      action == "accept" ? accept_invite(userEmail) : deny_invite(userEmail);
    const url = `${baseUrl}${actionUrl}`;

    await axios.post(url);
    setUpdatePage(`${Math.random() * 10000}`);
  }

  function onChangeSendComplimentHandler(e) {
    const value = e.target.value;
    setSendComplimentFieldValue(value);
  }
  async function onSubmitSendComplimentHandler(e) {
    const key = e.code;

    if (key === "Enter") {
      e.target.value = "";

      const url = `${baseUrl}${requests.users.send_compliment(
        userDataParseToJson.email,
      )}`;

      await axios.post(url, {
        message: sendComplimentFieldValue,
      });

      setSendComplimentFieldValue("");
      setUpdatePage(`${Math.random() * 10000}`);
    }
  }
  function onChangeSendFriendRequestHandler(e) {
    const value = e.target.value;
    setSendRequestFIeld(value);
  }
  async function onSubmitSendFriendRequestHandler(e) {
    const key = e.code;

    if (key === "Enter") {
      try {
        e.target.value = "";

        const url = `${baseUrl}${requests.users.friends_send_invite(
          sendRequestFIeld,
        )}`;

        await axios.post(url);

        const alertContent = new AlertMessageFactory(
          "success",
          "Convite enviado com sucesso !",
        );

        setAlertMessage(alertContent);
        setSendRequestFIeld("");
        setUpdatePage(`${Math.random() * 10000}`);
      } catch (e) {
        console.error(e);
        const alertContent = new AlertMessageFactory("error", `${e}`);

        // aqui é a area azulzinha do perfil
        // voce parou aqui, onde se encontra um erro na página userPage..., Possivelmente no Provider do context...
        setAlertMessage(alertContent);
      }
    }
  }

  return (
    <div className="info_area">
      <div
        className="profile_picture"
        style={{
          backgroundImage: `url(${
            userDataParseToJson.profile_picture_link
              ? userDataParseToJson.profile_picture_link
              : "https://thumbs.dreamstime.com/z/no-user-profile-picture-24185395.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "200px",
          height: "200px",
          border: "solid 10px #116aee",
          borderRadius: "100%",
        }}
      >
        {userOwner && (
          <EditIcon
            className="edit_button"
            id="edit_profile_picture"
            onClick={profilePictureUpdateHandler}
          />
        )}
      </div>
      <br />
      <div>
        <h2>{userDataParseToJson.name}</h2>
        <small>
          <strong>{userDataParseToJson.email}</strong>
        </small>
        {isThereInvitationRequest && (
          <div>
            <br />
            <ButtonGroup variant="contained">
              <Button onClick={() => requestHandler("accept")}>Aceitar</Button>
              <Button onClick={() => requestHandler("deny")}>Negar</Button>
            </ButtonGroup>
          </div>
        )}
        {!userOwner ? (
          <div>
            <br />
            <TextField
              label="Fazer Elogio"
              variant="filled"
              color="secondary"
              onChange={onChangeSendComplimentHandler}
              onKeyPress={onSubmitSendComplimentHandler}
              value={sendComplimentFieldValue}
            />
          </div>
        ) : (
          <div>
            <br />
            <br />
            <PersonAddIcon />
            <br />
            <TextField
              label="Nova Amizade"
              variant="filled"
              color="secondary"
              onChange={onChangeSendFriendRequestHandler}
              onKeyPress={onSubmitSendFriendRequestHandler}
              value={sendRequestFIeld}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoAreaComponent;
