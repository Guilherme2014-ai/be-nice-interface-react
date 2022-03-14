import React, { useContext } from "react";

const sessionProviderContext = React.createContext(null);
const getSessionContext = () => useContext(sessionProviderContext);

export { sessionProviderContext, getSessionContext };
