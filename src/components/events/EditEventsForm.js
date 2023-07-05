"use client";
import React from "react";
import { useFormik } from "formik";
import { eventValidationSchema } from "@/utils/ValidationSchemas";

const EditEventForm = ({ event }) => {
  const initialValues = {
    name: event.name,
    date: event.date,
    time: event.time,
    venue: event.venue,
    isCompleted: event.isCompleted,
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `/api/events/edit/${event._id}`,
        values
      );
      console.log("Response from server:", response.data);
      formik.resetForm();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: eventValidationSchema,
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
          placeholder="e.g Senior Four Prom"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="error">{formik.errors.name}</div>
        ) : null}
      </div>

      {/* Date */}
      <div className="mt-4">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.date}
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="error">{formik.errors.date}</div>
        ) : null}
      </div>

      {/* Time */}
      <div className="mt-4">
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          name="time"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.time}
        />
        {formik.touched.time && formik.errors.time ? (
          <div className="error">{formik.errors.time}</div>
        ) : null}
      </div>

      {/* Venue */}
      <div className="mt-4">
        <label htmlFor="venue">Venue:</label>
        <input
          type="text"
          id="venue"
          name="venue"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.venue}
          placeholder="e.g Main Building"
        />
        {formik.touched.venue && formik.errors.venue ? (
          <div className="error">{formik.errors.venue}</div>
        ) : null}
      </div>

      {/* Completed Status */}
      <div className="flex-align-center gap-x-2 mt-4">
        <input
          type="checkbox"
          id="isCompleted"
          name="isCompleted"
          onChange={formik.handleChange}
          checked={formik.values.isCompleted}
        />
        <label htmlFor="isCompleted">Completed:</label>
      </div>

      <button type="submit" className="btn" disabled={formik.isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default EditEventForm;
