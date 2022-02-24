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
  const [photosLink, setPhotoLinks] = useState([]);

  console.log("photo", user, cinema);
  const handleClick = () => {
    setOpen((prev) => !prev);
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

  function handleTakePhoto(photoUri) {
    const imageRef = ref(
      storage,
      `${cinema.name}/${item.item_ref}/${item.item_ref}-${item.photos.length}`
    );
    console.log("path", imageRef.fullPath);
    let newArrayApp = item.photos;
    newArrayApp.push(imageRef.fullPath);
    setItem({ ...item, photos: newArrayApp });

    const metadata = {
      contentType: "image/jpg",
      customMetadata: {
        item_ref: `${item.item_ref}`,
        makeBy: `${user.name}`,
        takeAt: moment().format("MMMM Do YYYY, h:mm:ss a")
      }
    };

    uploadBytes(imageRef, photoUri, metadata).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }

  const takePhoto = () => {
    if (cinema) {
      const path = `${cinema.name}/${item.item_ref}`;
      const listRef = ref(storage, `${path}`);
      // Find all the prefixes and items.
      listAll(listRef)
        .then((res) => {
          res.prefixes.forEach((folderRef) => {
            console.log("ref", folderRef);
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
          });
          res.items.forEach((itemRef) => {
            /* console.log(itemRef.toString()); */
            getDownloadURL(ref(storage, `${itemRef}`))
              .then((url) => {
                setPhotoLinks((a) => [...a, url]);
                console.log(photosLink);
                const xhr = new XMLHttpRequest();
                xhr.responseType = "blob";
                xhr.onload = (event) => {
                  const blob = xhr.response;
                  console.log("blob", blob);
                };
                xhr.open("GET", url);
                xhr.send();
              })
              .catch((error) => {
                console.log(error);
              });
            // All the items under listRef.
          });
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        });
      console.log("ciao");
    }
  };

  useEffect(() => {
    takePhoto();
  }, [item]);

  return (
    <Container>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box sx={{ position: "relative" }}>
          <Button type="button" onClick={handleClick}>
            Open Camera
          </Button>

          {open ? (
            <Box sx={styles}>
              <Camera
                idealResolution={{ width: 300, height: 300 }}
                onTakePhoto={(photoUri) => {
                  handleTakePhoto(photoUri);
                }}
              />
            </Box>
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
        {photosLink.length > 0 ? (
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {photosLink.map((item, key) => (
              <ImageListItem key={key}>
                <img src={item} srcSet={item} alt={item.title} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        ) : null}
      </Box>
    </Container>
  );
}

export default SetCamera;
