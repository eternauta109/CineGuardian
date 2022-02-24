import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CredentialContext } from "../contex/StoreContext";
import { useContext, useState, useEffect } from "react";
import { db } from "../config/firebase_config";

import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  getDocs,
  query,
  where
  /* addDoc,
  updateDoc,
  doc,
  deleteDoc */
} from "firebase/firestore";

const columns = [
  { field: "id", headerName: "ID", width: 10 },
  {
    field: "area",
    headerName: "area",
    width: 60
  },
  {
    field: "cinema",
    headerName: "cinema name",
    description: "This column has a value getter and is not sortable.",

    width: 120
  },
  {
    field: "areaCinema",
    headerName: "cinema area",
    width: 120
  },
  {
    field: "problem",
    headerName: "problem",
    description: "This column has a value getter and is not sortable.",

    width: 200
  },
  {
    field: "category",
    headerName: "category",
    type: "number",
    width: 120
  },
  {
    field: "competence",
    headerName: "competence",
    description: "This column has a value getter and is not sortable.",

    width: 120
  },

  {
    field: "stDate",
    headerName: "start date",
    description: "This column has a value getter and is not sortable.",
    type: "dateTime",

    width: 200
  },
  {
    field: "quotation",
    headerName: "quotation",
    description: "This column has a value getter and is not sortable.",

    width: 100
  }
];

const theme = createTheme();
const Home = () => {
  const { user, lists, setLists, cinemaObj } = useContext(CredentialContext);

  const getListItem = () => {
    console.log("home", cinemaObj);

    cinemaObj.forEach(async (e) => {
      console.log(e.name);
      const q = query(
        collection(db, "anomalies"),
        where("cinema", "==", `${e.name}`)
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let newItem = {
          id: doc.id,
          ...doc.data()
        };
        setLists((oldArray) => [...oldArray, newItem]);

        /* console.log(doc.id, " => ", doc.data()); */
      });
    });
  };

  useEffect(() => {
    setLists([]);
    getListItem();
    console.log("lists", lists);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={lists}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </ThemeProvider>
  );
};

export default Home;
