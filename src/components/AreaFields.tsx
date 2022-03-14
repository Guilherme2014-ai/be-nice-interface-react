/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

import axios from "axios";
import { idUniqueV2 } from "id-unique-protocol";

import "./AreaFields.css";

import { IAreaFieldsProps } from "../interfaces/IAreaFieldsProps";

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";

import { config, requests } from "../requests/benice_api";
import ToRequestPayloadFactory from "../factory/ToRequestPayloadFactory";
import AlertMessageFactory from "../factory/AlertMessageFactory";
import setSession from "../session/setSession";
import EntriesToObjFactory from "../factory/EntriesToObjFactory";
import { getSessionContext } from "../contexts/sessionContext";
import { getAlertContext } from "../contexts/alertContext";

const AreaFields: React.FC<IAreaFieldsProps> = ({
  title,
  fields,
  className,
}) => {
  const [isThereSession, setIsThereSession] = getSessionContext();
  const [alertMessage, setAlertMessage] = getAlertContext();
  const [fieldsState, setFieldsState] = useState({});

  function emptyFieldState(currentFieldState: object) {
    const currentFieldStateEntries = Object.entries(currentFieldState);

    const fieldsEmpty = currentFieldStateEntries.map((field) => {
      const [key] = field;
      return [key, ""];
    });

    return EntriesToObjFactory(fieldsEmpty);
  }

  function inputChangeHandler(e) {
    const element: HTMLInputElement = e.target;
    const value: string = element.value;

    const { id: elemName } = element;

    fieldsState[`${elemName}`] = value;
    setFieldsState(fieldsState);
  }

  async function sendUserCreateRequestHandler(e) {
    try {
      const elem: HTMLButtonElement = e.target;
      const url: string = elem.value;

      const requestPayload = ToRequestPayloadFactory(fieldsState);

      await axios.post(url, {
        ...requestPayload,
      });

      const alertMessage = new AlertMessageFactory(
        "success",
        "Usuário Criado. Agora Faça o Login !",
      );

      const emptyFields = emptyFieldState(fieldsState);
      setFieldsState(emptyFields);
      setAlertMessage(alertMessage);
    } catch (e) {
      console.error(e);
      const {
        status,
        data: { Error: error_message },
      } = e.response;

      const errorAlert = new AlertMessageFactory(
        "error",
        `${status} - ${error_message}`,
      );

      setAlertMessage(errorAlert);
    }
  }
  async function sendUserLoginRequestHandler(e) {
    try {
      const elem: HTMLButtonElement = e.target;
      const url: string = elem.value;

      const requestPayload = ToRequestPayloadFactory(fieldsState);

      const response = await axios.post(url, {
        ...requestPayload,
      });
      const {
        data: { user, token },
      } = response;

      const successAlert = new AlertMessageFactory(
        "success",
        "Logado com Sucesso. Para Mais Acesso confirme seu Email !",
      );
      setAlertMessage(successAlert);

      setIsThereSession(true);
      setSession(token, user);
    } catch (e) {
      console.error(e);
      const {
        status,
        data: { Error: error_message },
      } = e.response;

      const errorAlert = new AlertMessageFactory(
        "error",
        `${status} - ${error_message}`,
      );

      setAlertMessage(errorAlert);
    }
  }

  const types = {
    register_password: "password",
    login_password: "password",

    register_email: "email",
    login_email: "email",
  };

  return (
    <div className={`${className}`}>
      <h2>{title}</h2>

      <br />

      {fields.map((fieldName) => (
        <div key={idUniqueV2()} className="field">
          <TextField
            onChange={inputChangeHandler}
            type={types[fieldName.name] ? types[fieldName.name] : "text"}
            value={fieldsState[`${fieldName.name}`]}
            id={`${fieldName.name}`}
            className={`standard basic-${fieldName.name}`}
            label={`${fieldName.label}`}
            variant="standard"
            required={true}
          />
        </div>
      ))}

      <br />

      {title === "Cadastro" ? (
        <Button
          onClick={sendUserCreateRequestHandler}
          variant="contained"
          className="area_register_login_button"
          value={`${config.baseUrl}${requests.users.create}`}
        >
          Cadastro
        </Button>
      ) : (
        <Button
          onClick={sendUserLoginRequestHandler}
          variant="contained"
          className="area_register_login_button"
          value={`${config.baseUrl}${requests.users.login}`}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export { AreaFields };
