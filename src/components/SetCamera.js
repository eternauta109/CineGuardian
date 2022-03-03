import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import FlipCameraIosRoundedIcon from "@mui/icons-material/FlipCameraIosRounded";
import CameraRoundedIcon from "@mui/icons-material/CameraRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { storage } from "../config/firebase_config";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import moment from "moment";
import { Box, Button, Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Container from "@mui/material/Container";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";

function SetCamera({ user, cinema, item, setItem }) {
  const [open, setOpen] = useState(false);

  const [blob, setBlob] = useState();
  const [images, setImages] = useState([]);

  /* console.log("photo", user, cinema); */

  const styles = {
    position: "absolute",
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid",
    p: 1,
    bgcolor: "background.paper",
  };

  function loadXHR(url) {
    return new Promise(function (resolve, reject) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onerror = function () {
          reject("Network error.");
        };
        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject("Loading error:" + xhr.statusText);
          }
        };
        xhr.send();
      } catch (err) {
        reject(err.message);
      }
    });
  }

  const onTakePhotoHandler = (photoUri) => {
    //metto la foto in array locale per visulizzarle
    if (!item.item_ref) {
      return alert("scegli prima un cienam");
    }
    /* console.log(photoUri); */
    if (images.length > 2) {
      return alert("al massimo puoi memorizzare 3 photo");
    }
    const snapTime = moment().format("MMMM Do YYYY h:mm:ss a");
    const name = `${cinema.name}/${item.item_ref}/${item.item_ref}-${snapTime}.jpg`;

    const newObj = {
      name,
      photo: photoUri,
    };

    const newImages = [...images];

    newImages.push(newObj);

    console.log("newimages", newImages);
    setImages(newImages);
  };

  const uploadImages = () => {
    console.log(images);
    const urlArray = [];

    for (const i in images) {
      let obj = images[i];
      console.log("obj", obj);
      loadXHR(obj.photo).then(function (blob) {
        // here the image is a blob
        setBlob(blob);
      });

      const imageRef = ref(storage, obj.name);
      const metadata = {
        contentType: "image/jpeg",

        customMetadata: {
          name: `${obj.name}`,
          author: `${user.name}`,
        },
      };
      const uploadTask = uploadBytesResumable(imageRef, blob, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            urlArray.push(downloadURL);
          });
        }
      );
    }
    setItem({ ...item, photos: urlArray });
  };

  const removePhoto = (index) => {
    console.log(index);
    const arrayApp = [...images];
    arrayApp.splice(index, 1);

    setImages(arrayApp);
  };

  const ViewCamera = () => {
    if (open) {
      return (
        <Container
          sx={{
            p: 2,
            m: 2,
            display: "flex",
            height: "400",
            width: "640",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Camera
            onTakePhoto={onTakePhotoHandler}
            idealFacingMode="environment"
            isImageMirror={false}
            idealResolution={{ width: 300, height: 300 }}
          />
        </Container>
      );
    } else {
      return null;
    }
  };

  const openCamera = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setImages([]);
    setOpen(false);
    return () => {
      setOpen(false);
    };
  }, [item.item_ref]);

  return (
    <Container>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <IconButton
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onClick={openCamera}
          aria-label="openCamera"
          size="large"
        >
          {!open ? <p>open camera </p> : <p>close camera </p>}
          <CameraRoundedIcon />
        </IconButton>
      </Container>

      <ViewCamera />

      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {images.map((obj, index) => (
          <Container key={index} sx={{ width: "150px", paddingRight: "12px" }}>
            <img alt="cam" src={obj.photo} style={{ width: "100%" }} />
            <IconButton
              onClick={() => removePhoto(index)}
              aria-label="delete"
              size="small"
              sx={{ m: -1 }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Container>
        ))}
      </Container>
      {images.length ? (
        <Button
          onClick={uploadImages}
          variant="contained"
          color="success"
          sx={{ m: 2 }}
        >
          UPLOAD
        </Button>
      ) : null}
    </Container>
  );
}

export default SetCamera;
