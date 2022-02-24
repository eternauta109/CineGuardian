import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../config/firebase_config";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc
  /* addDoc,
  updateDoc,
  doc,
  deleteDoc */
} from "firebase/firestore";
/* import LoginContext from "../contex/LoginContext" */
import { CredentialContext } from "../contex/StoreContext";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Dev By  "}
      <Link color="inherit" href="#">
        Fabio Conti
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

// main function

export default function SignIn() {
  const { setUser, setCinemaObj } = useContext(CredentialContext);
  const password = useRef(null);
  const username = useRef(null);
  const userDb = collection(db, "user");
  const cinemaDb = collection(db, "cinema");
  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    setCinemaObj([]);
    event.preventDefault();
    /* const data = new FormData(event.currentTarget); 
    questo è un bel modo di prendere i dai del form
    */

    let passwordValue = password.current.value;
    let usernameValue = username.current.value;

    console.log(passwordValue, usernameValue);

    if (!passwordValue || !usernameValue) {
      return alert("inserire i campi");
    }

    const userRef = doc(db, "user", `${usernameValue}`);
    //risposta della query
    const userSnap = await getDoc(userRef);

    console.log(userSnap.data());

    if (!userSnap.exists()) {
      return alert("username error");
    }

    if (passwordValue !== userSnap.data().password) {
      return alert("password error");
    }

    switch (userSnap.data().role) {
      case "fm": //facilities
      case "am": //area manager
        const q = query(
          collection(db, "cinema"),
          where("area", "==", `${userSnap.data().area}`)
        );
        const cinemasSnap = await getDocs(q);
        console.log(cinemasSnap);
        cinemasSnap.forEach((element) => {
          console.log(element.id, element.data());
          setCinemaObj((oldArray) => [...oldArray, element.data()]);
        });
        console.log("facilitie");
        break;

      case "gm": //ops manager
        const allCinema = await getDocs(collection(db, "cinema"));
        allCinema.forEach((e) => {
          console.log(e.id, e.data());
          setCinemaObj((oldArray) => [...oldArray, e.data()]);
          console.log("ops manager");
        });
        break;

      case "m": //manager
      case "hm": //head manager
        console.log("direttore");
        const cinemaRef = doc(db, "cinema", `${userSnap.data().cinema}`);
        const cinemaSnap = await getDoc(cinemaRef);

        setCinemaObj((oldArray) => [...oldArray, cinemaSnap.data()]);
        break;

      default:
        break;
    }
    setUser(userSnap.data());
    navigate("/home");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              inputRef={username}
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              inputRef={password}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
