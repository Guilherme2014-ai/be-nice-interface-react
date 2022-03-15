import React from "react";
import  { useNavigate } from 'react-router-dom'

const LostedComponent: React.FC = () => {
  const navegate = useNavigate();
  navegate("/users/create");

  return <h1>Perdido ?</h1>;
};

export { LostedComponent };
