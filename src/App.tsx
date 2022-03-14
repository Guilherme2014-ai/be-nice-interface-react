// Dependencies
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import { CreateUsersComponents } from "./components/CreateUsersComponents";
import { EmailConfirmationComponent } from "./components/EmailConfirmationComponent";
import { FriendsPageComponent } from "./components/FriendsPageComponent";
import { NavMainComponent } from "./components/NavMainComponent";
import { UserPageComponent } from "./components/UserPageComponent";
import { LostedComponent } from "./components/LostedComponent";

// Contexts
import { AlertProviderContext } from "./contexts/alertContext";
import { sessionProviderContext } from "./contexts/sessionContext";

function App() {
  const [updatePage, setUpdatePage] = useState("");
  const [isThereSession, setIsThereSession] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Token Verification
  useEffect(() => {
    function sessionVerification() {
      const token = sessionStorage.getItem("token");
      token ? setIsThereSession(true) : setIsThereSession(false);
    }
    sessionVerification();
  });

  return (
      <sessionProviderContext.Provider
        value={[isThereSession, setIsThereSession]}
      >
        <AlertProviderContext.Provider value={[alertMessage, setAlertMessage]}>
          <NavMainComponent
            linkList={[{ title: "Friends", url: "/users/friends" }]}
            updatePageParam={[updatePage, setUpdatePage]}
          />
          <Routes>
            <Route path="/users/create" element={<CreateUsersComponents />} />
            <Route path="/users/friends" element={<FriendsPageComponent />} />
            <Route
              path="/users/email/verification/:email/:secret"
              element={<EmailConfirmationComponent />}
            />
            <Route path="/" element={<LostedComponent />} />
            <Route
              path="/users/me"
              element={
                <UserPageComponent
                  userOwner={true}
                  updatePageParam={[updatePage, setUpdatePage]}
                />
              }
            />
            <Route
              path="/users/:user_email"
              element={
                <UserPageComponent
                  userOwner={false}
                  updatePageParam={[updatePage, setUpdatePage]}
                />
              }
            />
          </Routes>
        </AlertProviderContext.Provider>
      </sessionProviderContext.Provider>
  );
}

export default App;
