import EntriesToObjFactory from "./EntriesToObjFactory";

const requestPayloadTranslate = {
  register_name: "name",
  login_name: "name",

  register_email: "email",
  login_email: "email",

  register_password: "password",
  login_password: "password",
};

export default (obj: object): object => {
  const objEntries = Object.entries(obj);

  const objEntriesTranslated = objEntries.map((key_value) => {
    const key = key_value[0];
    const translate = requestPayloadTranslate[`${key}`];

    key_value[0] = translate;
    return key_value;
  });

  const objTranslated = EntriesToObjFactory(objEntriesTranslated);

  return objTranslated;
};
