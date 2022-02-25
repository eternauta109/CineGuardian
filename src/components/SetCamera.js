import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import FlipCameraIosRoundedIcon from "@mui/icons-material/FlipCameraIosRounded";
import CameraRoundedIcon from "@mui/icons-material/CameraRounded";
import { storage } from "../config/firebase_config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import moment from "moment";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Container from "@mui/material/Container";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";

function SetCamera({ user, cinema, item, setItem }) {
  const [open, setOpen] = useState(false);
  const [photosLink, setPhotoLinks] = useState(null);

  /* console.log("photo", user, cinema); */
  const handleClick = () => {
    setOpen((prev) => !prev);
    console.log(open)
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const styles = {
    position: "absolute",
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: "1px solid",
    p: 1,
    bgcolor: "background.paper"
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

  const handleTakePhoto = async (photoUri) => {
    //metto la foto in array locale per visulizzarle
    const snapTime = moment().format("MMMM Do YYYY h:mm:ss a")

    const imageRef = ref(
      storage,
      `${cinema.name}/${item.item_ref}/${item.item_ref}-${snapTime}.jpg`
    );






    //creao array di percorsi
    console.log("path", imageRef.toString());
    let newArrayApp = item.photos;
    newArrayApp.push(imageRef.fullPath);
    console.log("array item in photo", item);
    setItem({ ...item, photos: newArrayApp });
    console.log("array item", item.photos)


    //setto i metadata
    const metadata = {
      contentType: "image/jpg",
      customMetadata: {
        item_ref: `${item.item_ref}`,
        makeBy: `${user.name}`,
        takeAt: snapTime
      }
    };

    //carico il file
    await loadXHR(photoUri).then(function (blob) {
      // here the image is a blob
      uploadBytes(imageRef, blob, metadata).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
    });

  }

  const takePhoto = async () => {
    console.log("winner in take photo");

    if (cinema) {
      setPhotoLinks([]);
      const path = `${cinema.name}/${item.item_ref}`;

      const listRef = ref(storage, `${path}`);

      // Find all the prefixes and items.
      await listAll(listRef)
        .then((res) => {
          res.prefixes.forEach((folderRef) => {
            console.log("ref", folderRef.toString());
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
          });
          res.items.forEach((itemRef) => {
            /* console.log(itemRef.toString()); */
            getDownloadURL(ref(storage, `${itemRef}`))
              .then((url) => {
                console.log("url", url);
                setPhotoLinks((e) => [...e, url]);

              })
              .catch((error) => {
                console.log(error);
              });
            // All the items under listRef.
          });
        })
        .catch((error) => {
          console.log(error)
          // Uh-oh, an error occurred!
        });
    }
  };

  useEffect(() => {
    takePhoto();
    /* console.log("photolink", photosLink); */
  }, [item.item_ref]);

  return (
    <Container>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: "relative" }}>
          <Button type="button" onClick={handleClick}>
            Open Camera
          </Button>

          {open && cinema ? (
            <>
              <Box sx={styles}>
                <Camera
                  idealResolution={{ width: 300, height: 300 }}
                  onTakePhoto={(photoUri) => {
                    handleTakePhoto(photoUri);
                  }}
                />
              </Box>
            </>
          ) : null}
        </Box>
      </ClickAwayListener>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
          width: "auto"
        }}
      >
        {photosLink && photosLink.length ? (
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {photosLink.map((item, key) => (
              <ImageListItem key={key}>
                <img src={item} srcSet={item} alt={item.title} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        ) : <h2>no image for this item</h2>}
      </Box>
    </Container>
  );
}

export default SetCamera;
