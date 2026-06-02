import { useState } from "react";
import Login from "./components/Login";
import Desktop from "./components/Desktop";
import "./styles/App.css";

function App() {
  /* const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );

  function handleLogin() {
    sessionStorage.setItem("loggedIn", "true");
    setIsLoggedIn(true);
  }
  */

  return (
    <>

        <Login />
    </>
  );
}

export default App;