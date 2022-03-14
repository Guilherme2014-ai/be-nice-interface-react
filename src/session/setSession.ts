import IUserPayload from "../interfaces/IUserPayload";

export default (token: string, user?: IUserPayload): void => {
  if (user) sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("token", token);

  if (sessionStorage.getItem("token") == token) console.log("Mudou !");
};
