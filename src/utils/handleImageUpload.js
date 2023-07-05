import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const handleImageUpload = (
  e,
  setUploading,
  setPercentage,
  sethideProgressWrapper,
  formik,
  progressRef,
  folder
) => {
  setUploading(true);
  // Create a reference to the image
  const storageRef = ref(storage, `${folder}/${e.target.files[0].name}`);
  const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      //   Get the upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercentage(progress.toFixed(0));
      sethideProgressWrapper(false);
      progressRef.current.style.width = `${progress}%`;
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log(error.message);
    },
    () => {
      // Handle successful uploads on complete and get the download url
      sethideProgressWrapper(true);
      setUploading(false);
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        formik.setFieldValue("imageUrl", downloadURL);
        console.log("File available at", downloadURL);
      });
    }
  );
};
