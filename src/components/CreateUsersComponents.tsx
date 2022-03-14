import React from "react";
import { idUniqueV2 } from "id-unique-protocol";

import { AreaFields } from "./AreaFields";
import { AlertComponent } from "./AlertComponent";

import "./CreateUsersComponents.css";

const CreateUsersComponents: React.FC = () => {
  return (
    <section className="content_area">
      <AlertComponent />
      <div className="register_login_area">
        <AreaFields
          title="Cadastro"
          key={idUniqueV2()}
          className="register"
          fields={[
            {
              name: "register_name",
              label: "Nome",
            },
            {
              name: "register_email",
              label: "Email",
            },
            {
              name: "register_password",
              label: "Senha",
            },
          ]}
        />

        <AreaFields
          title="Login"
          key={idUniqueV2()}
          className="login"
          fields={[
            {
              name: "login_email",
              label: "Email",
            },
            {
              name: "login_password",
              label: "Senha",
            },
          ]}
        />
      </div>
    </section>
  );
};

export { CreateUsersComponents };

// Botões...
