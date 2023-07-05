"use client";
import React from "react";
import { useFormik } from "formik";
import { subjectValidationSchema } from "@/utils/ValidationSchemas";

const AddSubjectForm = () => {
  const initialValues = {
    name: "",
    description: "",
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("/api/subjects/create", values);
      console.log("Response from server:", response.data);
      formik.resetForm();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: subjectValidationSchema,
    onSubmit: handleSubmit,
  });

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
          placeholder="e.g Computer Science"
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

      <button type="submit" className="btn" disabled={formik.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default AddSubjectForm;
