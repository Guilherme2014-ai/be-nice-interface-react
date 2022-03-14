import React, { useContext } from "react";

const AlertProviderContext = React.createContext(null);
const getAlertContext = () => useContext(AlertProviderContext);

export { AlertProviderContext, getAlertContext };
