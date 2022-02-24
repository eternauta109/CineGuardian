import InputAnomalies from "../components/AnomaliesForm";
import { useContext, useState, useEffect } from "react";

import { db } from "../config/firebase_config";

import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

import { CredentialContext } from "../contex/StoreContext";
import { itemInit } from "../config/struttura";

const Anomalies = () => {
  const { user, cinemaObj, setCinemaObj } = useContext(CredentialContext);
  console.log("anomalies.js user e cinemaObj", user, cinemaObj);
  const [item, setItem] = useState({ ...itemInit });

  const handleSubmit = async () => {
    let stDate = new Date().toLocaleString("it");
    console.log("item anomalies", item);
    if (item.category === "" || item.priority === "") {
      return alert("devi selezionare una categoria");
    }

    const itemRef = doc(db, "anomalies", `${item.item_ref}`);

    const res = await setDoc(itemRef, {
      ...item,
      stDate
    });

    const cinemaRefNum_increment = doc(db, "cinema", `${item.cinema}`);

    await updateDoc(cinemaRefNum_increment, {
      rif_num: increment(1)
    });
    const docSnap = await getDoc(cinemaRefNum_increment);
    console.log("prendo il cinema", docSnap.data().rif_num);

    setCinemaObj(
      cinemaObj.map((element) =>
        element.name === item.cinema
          ? { ...element, rif_num: docSnap.data().rif_num }
          : element
      )
    );

    console.log("cinemobj agg", cinemaObj);

    console.log("Document written with ID: ", itemRef.id);
    let newArray = [];
    setItem({ ...itemInit, comments: newArray, photos: newArray });

    return res;
  };

  useEffect(() => {
    /* let azzeraComments = [];
    let newArrayApp = []; */
    setItem({ ...itemInit, comments: [], photos: [] });
  }, [setItem]);

  return (
    <>
      <InputAnomalies
        cinema={cinemaObj}
        item={item}
        setItem={setItem}
        handleSubmit={handleSubmit}
        user={user}
      />
    </>
  );
};

export default Anomalies;
