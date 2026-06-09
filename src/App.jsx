import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seatNo, setSeatNo] = useState("");

  // This handles the transition once the PHP API clears them
  const handleLoginSuccess = (verifiedSeat) => {
    setSeatNo(verifiedSeat);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard seatNo={seatNo} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;