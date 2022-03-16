// Dependencies
import React, { Dispatch, useEffect, useRef, useState } from "react";
import Lottie from "lottie-web";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { idUniqueV2 } from "id-unique-protocol";
import { config, requests } from "../requests/benice_api";

// Components
import { Avatar, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoAreaComponent from "./InfoAreaComponent";
import { AlertComponent } from "./AlertComponent";

// Interfaces
interface IProps {
  userOwner: boolean;
  updatePageParam: TUpdatePage;
}
/*interface IFriends {
  id: number;
  name: string;
  email: string;
  profile_picture_link: string;
}*/
/*interface IUserData {
  id: number;
  name: string;
  email: string;
  profile_picture_link: string;
  user_text: string;
  compliments_receiveds: any[];
  friends: IFriends[];
}*/
type TUpdatePage = [updatePage: string, setUpdatePage: Dispatch<string>];

// CSS
import "./UserPageComponent.css";

// Others
let isThereInvitationRequest = false;
let animationLoadTImes = 0;

const UserPageComponent: React.FC<IProps> = ({
  userOwner,
  updatePageParam,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updatePage, setUpdatePage] = updatePageParam;
  const [textField, setTextField] = useState("");

  const navigate = useNavigate();
  const { baseUrl } = config;
  // const delay = userOwner ? 2000 : 200;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData]: [any, Dispatch<any>] = useState(null);

  const token = sessionStorage.getItem("token");

  axios.defaults.headers.common["Authorization"] = `${token}`;

  const user_email = useParams().user_email ? useParams().user_email : null;

  const loadingAnimation = useRef(null);
  const sadWalkingAnimation = useRef(null);
  const orangeGuySwingingAnimation = useRef(null);

  // Carrega as Animações
  useEffect(() => {
    async function animationHandler() {
      async function loadLoadingAnimation() {
        const animationJsonLink =
          "https://assets10.lottiefiles.com/packages/lf20_4pa0oxjy.json";

        const animationJsonData = (await axios.get(animationJsonLink)).data;

        Lottie.loadAnimation({
          container: loadingAnimation.current, // the dom element that will contain the animation: ;
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animationJsonData, // the path to the animation json
        });
      }
      async function loadSadWalkingAnimation() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const animationJsonLink =
          "https://assets4.lottiefiles.com/private_files/lf30_aprp5fnm.json";

        const animationJsonData = (await axios.get(animationJsonLink)).data;

        Lottie.loadAnimation({
          container: sadWalkingAnimation.current, // the dom element that will contain the animation: ;
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animationJsonData, // the path to the animation json
        });
      }
      async function loadOrangGuySwingingAnimation() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const animationJsonLink =
          "https://assets4.lottiefiles.com/packages/lf20_t9nbbl1t.json";

        const animationJsonData = (await axios.get(animationJsonLink)).data;

        Lottie.loadAnimation({
          container: orangeGuySwingingAnimation.current, // the dom element that will contain the animation: ;
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: animationJsonData, // the path to the animation json
        });
      }

      await loadLoadingAnimation();
      await loadSadWalkingAnimation();
      await loadOrangGuySwingingAnimation();

      setUpdatePage("vai pokemon");
    }

    if (animationLoadTImes < 1) {
      animationLoadTImes++;
      animationHandler();
    }
  });
  // get user data
  useEffect(() => {
    async function getUserData() {
      const getEmailSession = () => {
        const user = JSON.parse(sessionStorage.getItem("user")) || null;
        return user ? user["email"] : user;
      };

      if (!getEmailSession()) {
        navigate("/users/create");
        return;
      }

      const email = user_email;

      if (email) {
        const isTheSame = email == getEmailSession();
        if (isTheSame) {
          navigate("/users/me");
        }
      }

      const emailRequest = email || getEmailSession();

      console.log(emailRequest);

      const user = await (
        await axios.get(`${baseUrl}${requests.users.userByEmail(emailRequest)}`)
      ).data["user"];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isThereInvitationRequest = user.friends_requests_sents.some(
        (emailInvitSents: any) => emailInvitSents == getEmailSession(),
      );
      setUserData(JSON.stringify(user));
    }

    getUserData();
  });

  const ImageUrlGenerator = (imageLink: string) =>
    !imageLink
      ? "url(https://thumbs.dreamstime.com/z/no-user-profile-picture-24185395.jpg)"
      : `url(${imageLink})`;

  function profileTextChangerHandler(e) {
    const elem = e.target;
    const value = elem.value;

    setTextField(`${value}`);
  }
  async function profileTextSubmitHandler(e) {
    const key = e.code;

    if (key === "Enter") {
      try {
        await axios.put(`${baseUrl}${requests.users.profile_textEdit}`, {
          text: textField,
        });
        setUpdatePage(`${Math.random() * 10000}`);
      } catch (e) {
        console.log("deu erro aqui bixo");
      }
    }
  }

  // Tudo se encaixando como um quebra-cabeça, isso graças a estratégia e propiedades bem definidas

  const userDataParseToJson = JSON.parse(userData);

  return (
    <div className="content" id="content">
      {!userData ? (
        <section className="animation_area">
          <div className="loading" ref={loadingAnimation}></div>
        </section>
      ) : (
        <div className="profile">
          <InfoAreaComponent
            userOwner={userOwner}
            userDataParseToJson={userDataParseToJson}
            updatePageParam={updatePageParam}
            isThereInvitationRequest={isThereInvitationRequest}
          />
          <div className="text_and_friends">
            <AlertComponent />
            {!userDataParseToJson.user_text && userOwner ? (
              <TextField
                id="outlined-multiline-static"
                label="Frase de Perfil"
                multiline
                rows={2}
                value={textField}
                onChange={profileTextChangerHandler}
                onKeyPress={profileTextSubmitHandler}
                defaultValue="Frase motivacional..."
              />
            ) : (
              <p>
                <strong>
                  "{" "}
                  {userDataParseToJson.user_text
                    ? userDataParseToJson.user_text
                    : "Sem Texto Motivacional ;-;"}{" "}
                  "
                </strong>
                {userOwner && (
                  <EditIcon
                    className="edit_profile_text"
                    id="edit_profile_text"
                    onClick={() => {
                      userDataParseToJson.user_text = null;
                      setUpdatePage(`${Math.random() * 10000}`);
                    }}
                  />
                )}
              </p>
            )}
            <br />
            {userDataParseToJson.friends.length > 0 ? (
              <div>
                <h2 id="friends_title">Amigos</h2>
                <div className="image_friends_area">
                  {userDataParseToJson.friends.map((friend) => {
                    return (
                      <Link to={`/#/users/${friend.email}`} key={idUniqueV2()}>
                      <div
                          className="image_friend"
                          style={{
                            backgroundImage: ImageUrlGenerator(
                              friend.profile_picture_link,
                            ),
                          }}
                        ></div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="contents_animation_area sad_walking_animation_area">
                {sadWalkingAnimation && (
                  <div className="sad_walking" ref={sadWalkingAnimation}>
                    <h2>Sem Amigos</h2>
                  </div>
                )}
              </div>
            )}

            {userDataParseToJson.compliments_receiveds.length > 0 ? (
              <div>
                <h2 id="friends_title">Elogios</h2>
                <div className="copliments_area">
                  {userDataParseToJson.compliments_receiveds.map(
                    (compliment) => {
                      const { message, user_image_link } = compliment;

                      console.log(compliment);

                      return (
                        <div className="compliment" key={idUniqueV2()}>
                          <Avatar
                            className="compliment_avatar"
                            alt="Avatar"
                            src={user_image_link.profile_picture_link}
                          />
                          <p>
                            <strong>{message}</strong>
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ) : (
              <div className="contents_animation_area">
                <div
                  ref={orangeGuySwingingAnimation}
                  className="orange_guy_swinging_animation"
                >
                  <h2>Sem Elogios</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { UserPageComponent };
