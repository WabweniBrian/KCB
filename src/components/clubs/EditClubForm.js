"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { storage } from "@/firebase.config";
import { FiTrash } from "react-icons/fi";
import { handleImageUpload } from "@/utils/handleImageUpload";
import { deleteObject, ref } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toolbarOptions } from "@/utils/react-quill-toolbar";
import { clubValidationSchema } from "@/utils/ValidationSchemas";

const EditClubForm = ({ club }) => {
  const imageInput = useRef(null);
  const [hideProgressWrapper, sethideProgressWrapper] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const progressRef = useRef();
  const imageRef = useRef();

  const initialValues = {
    name: club.name,
    description: club.description,
    content: club.content,
    imageUrl: club.imageUrl,
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`/api/clubs/edit/${club._id}`, values);
      console.log("Response from server:", response.data);
      formik.resetForm();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Upload Image
  const uploadImage = (e) => {
    handleImageUpload(
      e,
      setUploading,
      setPercentage,
      sethideProgressWrapper,
      formik,
      progressRef,
      "club"
    );
  };

  // Delete Image
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

  // useFormik hook to handle form state and validation--------------------------------------------------------------------
  const formik = useFormik({
    initialValues,
    validationSchema: clubValidationSchema,
    onSubmit: handleSubmit,
  });

  const handleEditorChange = (value) => {
    formik.setFieldValue("content", value);
  };

  const handleEditorBlur = () => {
    formik.setFieldTouched("content", true);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Name */}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          placeholder="e.g Computer Club"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="error">{formik.errors.name}</div>
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
          placeholder="Club Description"
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="error">{formik.errors.description}</div>
        ) : null}
      </div>

      {/* Image */}
      <div className="relative mt-4">
        <label htmlFor="image">Image (Optional)</label>
        <input type="file" hidden ref={imageInput} onChange={uploadImage} />
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

      {/* Content */}
      <div className="mt-4">
        <label htmlFor="content">Content:</label>
        <ReactQuill
          theme="snow"
          id="content"
          name="content"
          value={formik.values.content}
          onChange={handleEditorChange}
          onBlur={handleEditorBlur}
          modules={{ toolbar: toolbarOptions }}
          className="shadow-sm"
        />
        {formik.touched.content && formik.errors.content ? (
          <div className="error">{formik.errors.content}</div>
        ) : null}
      </div>
      <button type="submit" className="btn" disabled={formik.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default EditClubForm;
