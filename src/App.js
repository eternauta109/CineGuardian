import "./styles.css";

import { useContext } from "react";
import SignIn from "./featurs/Login";
import Navbar from "./components/Navbar";
import { CredentialContext } from "./contex/StoreContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "@mui/material/Container";
import Home from "./featurs/Home";
import Anomalies from "./featurs/Anomalies";
import NewUser from "./featurs/NewUser";

export default function App() {
  const { user } = useContext(CredentialContext);

  return (
    <div className="App">
      <Container>
        <Router>
          {user && <Navbar />}

          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="anomalies" element={<Anomalies />} />
            <Route path="newuser" element={user ? <NewUser /> : <SignIn />} />

            <Route path="home" element={user ? <Home /> : <SignIn />} />
            {/*  <Route
              path="anomalies"
              element={user ? <Anomalies /> : <SignIn />}
            /> */}
          </Routes>
        </Router>
      </Container>
    </div>
  );
}
