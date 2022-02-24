import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { db } from "../config/firebase_config";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { doc, setDoc, collection, addDoc, docRef } from "firebase/firestore";
import {
  userInit,
  areaSelect,
  cinemaSelect,
  roleSelect
} from "../config/struttura";

const NewUser = () => {
  const [newUser, setNewUser] = useState("");

  const handleSubmit = async (e) => {
    console.log(newUser);
    await setDoc(doc(db, "user", `${newUser.name}`), {
      ...newUser
    });
    setNewUser(userInit);
  };

  const handleChange = (e) => {
    /* console.log(e.target); */
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
    console.log(newUser);
  };
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        name="name"
        label="Name"
        value={newUser.name}
        onChange={handleChange}
      />
      <TextField
        name="email"
        label="email"
        value={newUser.email}
        onChange={handleChange}
      />
      <FormControl>
        <InputLabel htmlFor="role">Role</InputLabel>
        <Select
          onChange={(e) => handleChange(e)}
          value={newUser.role ?? ""}
          labelId="role"
          id="roleSelect"
          label="role"
          name="role"
        >
          {roleSelect.map((e, key) => {
            return (
              <MenuItem key={key} value={e}>
                {e}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="area">Area</InputLabel>
        <Select
          onChange={(e) => handleChange(e)}
          value={newUser.area ?? ""}
          labelId="area"
          id="areaSelect"
          label="area"
          name="area"
        >
          {areaSelect.map((e, key) => {
            return (
              <MenuItem key={key} value={e}>
                {e}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="cinema">Cinema</InputLabel>
        <Select
          onChange={(e) => handleChange(e)}
          value={newUser.cinema ?? ""}
          labelId="cinema"
          id="cinemaSelect"
          label="cinema"
          name="cinema"
        >
          {cinemaSelect.map((e, key) => {
            return (
              <MenuItem key={key} value={e}>
                {e}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <TextField
        name="password"
        id="password"
        label="password"
        value={newUser.password}
        onChange={handleChange}
      />

      <LoadingButton
        color="secondary"
        onClick={handleSubmit}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        size="large"
      >
        ADD ITEM
      </LoadingButton>
    </Box>
  );
};

export default NewUser;
