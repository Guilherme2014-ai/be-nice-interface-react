import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-web";
import axios from "axios";

import "./EmailConfirmationComponent.css";

import { config, requests } from "../requests/benice_api";
import setSession from "../session/setSession";

let emailsRequestsLimit = 0;

const EmailConfirmationComponent: React.FC = () => {
  const navigate = useNavigate();
  const { email, secret } = useParams();
  const [emailVerificationError, setEmailVerificationError] = useState(null);

  const ifSuccesDelayRedirect = 3000,
    setEmailVerificationDelay = 900;
  const redirectLink = "/create/user";

  const container = useRef(null);

  // Carrega a Animação
  useEffect(() => {
    async function loadAnimationHandler() {
      const animationJsonLink =
        "https://assets1.lottiefiles.com/packages/lf20_rhnmhzwj.json";

      const animationJsonData = (await axios.get(animationJsonLink)).data;

      Lottie.loadAnimation({
        container: container.current, // the dom element that will contain the animation: ;
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationJsonData, // the path to the animation json
      });
    }
    loadAnimationHandler();
  });

  // Manda o Request para a API de Email
  useEffect(() => {
    emailsRequestsLimit++;
    async function emailVerificationHandler() {
      try {
        const { baseUrl } = config;
        const { email_authentication } = requests.users;
        const generatedUrl = email_authentication(email, secret);
        const response = await axios.get(`${baseUrl}${generatedUrl}`);
        const {
          data: { new_token },
        } = response;

        setSession(new_token);
        setTimeout(
          () => setEmailVerificationError(false),
          setEmailVerificationDelay,
        );
        setTimeout(() => navigate(redirectLink), ifSuccesDelayRedirect);
      } catch (e) {
        console.error(e);
        const { status, data } = e.response;
        setTimeout(
          () => setEmailVerificationError({ status, data }),
          setEmailVerificationDelay,
        );
      }
    }

    if (emailsRequestsLimit < 2) emailVerificationHandler();
  });

  function printResponse(emailVerificationError) {
    if (emailVerificationError != null)
      return (
        <h1 className="content-h1">
          {emailVerificationError == false ||
          emailVerificationError.status == 406
            ? "Email Confirmed with Success !"
            : `
            Status - ${emailVerificationError.status}
            Error - ${emailVerificationError.data.Error} - Status: ${emailVerificationError.status}`}
        </h1>
      );
    return <div className="loading" ref={container}></div>;
  }

  return <main>{printResponse(emailVerificationError)}</main>;
};

export { EmailConfirmationComponent };
