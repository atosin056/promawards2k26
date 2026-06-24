import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Promadmindashboard from "./components/Promadmindashboard";
import Adminlogin from "./components/Adminlogin";
import Closed from "./components/Closed";
import Voting from "./components/Voting";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [seatNo, setSeatNo] = useState("");

  const handleLoginSuccess = (verifiedSeat) => {
    setSeatNo(verifiedSeat);
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Student flow */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Voting seatNo={seatNo} />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          {/* <Route
            path="/"
            element={
              <Voting />
            }
            /> */}
          {/* <Route
            path="/"
            element={
              <Closed />
            }
          /> */}

          {/* Admin flow */}
          <Route
            path="/promadmin"
            element={
              isAdminLoggedIn ? (
                <Promadmindashboard />
              ) : (
                <Adminlogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;