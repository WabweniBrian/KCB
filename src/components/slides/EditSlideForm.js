"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { storage } from "@/firebase.config";
import { FiTrash } from "react-icons/fi";
import { deleteObject, ref } from "firebase/storage";
import { slideValidationSchema } from "@/utils/ValidationSchemas";
import { handleImageUpload } from "@/utils/handleImageUpload";

const EditSlideForm = ({ slide }) => {
  const imageInput = useRef(null);
  const [hideProgressWrapper, sethideProgressWrapper] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const progressRef = useRef();
  const imageRef = useRef();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "/api/slides/edit/${slide._id}",
        values
      );
      console.log("Response from server:", response.data);
      formik.resetForm();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Upload Image-----------------------------------------------------------------------------------------------------------
  const uploadImage = (e) => {
    handleImageUpload(
      e,
      setUploading,
      setPercentage,
      sethideProgressWrapper,
      formik,
      progressRef,
      "slides"
    );
  };

  // Delete Image-----------------------------------------------------------------------------------------------------------
  const deleteImage = (image) => {
    const imageRef = ref(storage, image);
    formik.setFieldValue("imageUrl", "");
    deleteObject(imageRef)
      .then(() => {
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // useFormik hook to handle form state and validation
  const formik = useFormik({
    initialValues: {
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
    },
    validationSchema: slideValidationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Title */}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          placeholder="Slide title"
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="error">{formik.errors.title}</div>
        ) : null}
      </div>

      {/* Description */}
      <div className="mt-4">
        <label htmlFor="description">Description:</label>
        <textarea
          type="text"
          id="description"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          placeholder="Slide Description"
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="error">{formik.errors.description}</div>
        ) : null}
      </div>

      {/* Image */}
      <div className="relative mt-4">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          hidden
          ref={imageInput}
          onChange={uploadImage}
          onBlur={formik.handleBlur}
        />
        <img
          src={`${
            formik.values.imageUrl
              ? formik.values.imageUrl
              : "/images/coverphoto.png"
          }`}
          alt=""
          className={`w-full h-[200px] my-2 cursor-pointer object-cover rounded-md ${
            uploading && "opacity-40 pointer-events-none"
          }`}
          onClick={() => imageInput.current.click()}
          ref={imageRef}
        />
        <div
          className={`absolute top-2 right-2 bg-red-500 hover:opacity-80 text-white h-10 w-10 rounded-full sm:cursor-pointer hidden place-items-center ${
            formik.values.imageUrl && "!grid"
          }`}
          onClick={() => deleteImage(formik.values.imageUrl)}
        >
          <FiTrash />
        </div>

        <div className="mt-2">
          {formik.touched.imageUrl && formik.errors.imageUrl ? (
            <div className="error">{formik.errors.imageUrl}</div>
          ) : null}
        </div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden ${
            uploading && "!block"
          }`}
        >
          <div className="loader"></div>
        </div>
      </div>
      <div
        className={`flex-center-between gap-2 ${
          hideProgressWrapper && "!hidden"
        }`}
      >
        <div className="progressbar w-full h-2 bg-gray-300 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" ref={progressRef}></div>
        </div>
        <p className="ml-2 flex-shrink-0">{percentage}%</p>
      </div>

      <button type="submit" className="btn" disabled={formik.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default EditSlideForm;
