import Login from "./components/Login";
import Desktop from "./components/Desktop";
import { useState } from "react";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );

  function handleLogin() {
    sessionStorage.setItem("loggedIn", "true");
    setIsLoggedIn(true);
  }

  function handleLogout() {
    sessionStorage.setItem("loggedIn", "false");
    setIsLoggedIn(false);
  }

  return (
    <>
      {!isLoggedIn ? <Login onLogin={handleLogin} /> : <Desktop onLogout={handleLogout} />}
    </>
  );
}

export default App;