import React, { Dispatch } from "react";
import { Alert } from "@mui/material";

// Context
import { getAlertContext } from "../contexts/alertContext";
// Interface
import IAlertMessage from "../interfaces/IAlertMessage";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AlertStateParam = [IAlertMessage, Dispatch<any>];

const AlertComponent = () => {
  const [alertMessage, setAlertMessage]: AlertStateParam = getAlertContext();

  console.log(alertMessage);

  function alertScaleHandler() {
    const growScales = {
      down: { transform: "scale(0)" },
      up: { transform: "scale(1)" },
    };

    function growDownDelayFunc(delayToGrowDown) {
      setTimeout(() => setAlertMessage({}), delayToGrowDown);
    }

    if (alertMessage) {
      if (alertMessage.text) {
        const delayToGrowDown = 2500;
        growDownDelayFunc(delayToGrowDown);

        return growScales.up;
      }
      return;
    }

    return growScales.down;
  }

  return (
    <div>
      {alertMessage && (
        <Alert
          style={alertScaleHandler()}
          severity={alertMessage.severity}
          className={`alert alert-${alertMessage.severity}`}
          id="alert_page"
        >
          {alertMessage.text}
        </Alert>
      )}
    </div>
  );
};

export { AlertComponent };
