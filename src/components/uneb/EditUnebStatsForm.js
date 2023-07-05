/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { unebStatsValidationSchema } from "@/utils/ValidationSchemas";
import { FiTrash, FiX } from "react-icons/fi";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/firebase.config";

const EditUnebStatsForm = ({ grade }) => {
  const imageRef = useRef();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`/api/uneb/edit/${grade._id}`, values);
      console.log("Response from server:", response.data);
      formik.resetForm();
    } catch (error) {
      console.error("Error saving exam statistics:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      level: grade.level,
      totalStudents: grade.totalStudents,
      gradeStatistics: grade.gradeStatistics,
      bestStudents: grade.bestStudents,
    },
    validationSchema: unebStatsValidationSchema,
    onSubmit: handleSubmit,
  });

  const [progress, setProgress] = useState(
    Array(formik.values.bestStudents.length).fill(0)
  );

  // Image Upload--------------------------------------------------------------------------------------------------------------
  const uploadImage = (file, index) => {
    if (!file) return;
    const storageRef = ref(storage, `best_students/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get the progress as a percentage
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Update the specific best student's progress in the array
        setProgress((prevProgress) => {
          const newProgress = [...prevProgress];
          newProgress[index] = percentage;
          return newProgress;
        });
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            // Update the specific best student's imageUrl in the formik state
            formik.setFieldValue(
              `bestStudents[${index}].imageUrl`,
              downloadUrl
            );
            setProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = 0;
              return newProgress;
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    );
  };

  // Delete Image-----------------------------------------------------------------------------------------------------------
  const deleteImage = (imageUrl, index) => {
    if (!imageUrl) return; // If imageUrl is empty, there's no need to delete anything

    const imageRef = ref(storage, imageUrl);
    formik.setFieldValue(`bestStudents[${index}].imageUrl`, ""); // Update the specific best student's imageUrl to clear it

    deleteObject(imageRef)
      .then(() => {
        console.log("Image deleted successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // Helper function to add a new grade input field---------------------------------------------------------------------------------
  const addGradeField = () => {
    formik.setFieldValue("gradeStatistics", [
      ...formik.values.gradeStatistics,
      { grade: "", numberOfStudents: "" },
    ]);
  };

  // Helper function to remove a grade input field--------------------------------------------------------------------------------
  const removeGradeField = (index) => {
    const updatedGradeStatistics = formik.values.gradeStatistics.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("gradeStatistics", updatedGradeStatistics);
  };

  // Helper function to add a new best student field-------------------------------------------------------------------------------
  const addBestStudentField = () => {
    const newBestStudent = { name: "", gradeScore: "", imageUrl: "" };
    formik.setFieldValue(
      "bestStudents",
      [...formik.values.bestStudents, newBestStudent],
      true
    );
  };

  // Helper function to remove a best student field-------------------------------------------------------------------------------
  const removeBestStudentField = (index) => {
    const updatedBestStudents = formik.values.bestStudents.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("bestStudents", updatedBestStudents, true);
  };

  return (
    <>
      <h1 className="text-3xl font-semibold pb-3 border-b border-b-slate-300">
        Overall Details
      </h1>
      <form onSubmit={formik.handleSubmit}>
        {/* Level */}
        <div>
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            name="level"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.level}
            className="!text-base"
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="O-level">O-level</option>
            <option value="A-level">A-level</option>
          </select>
          {formik.touched.level && formik.errors.level ? (
            <div className="error">{formik.errors.level}</div>
          ) : null}
        </div>

        {/* Total Number of students */}
        <div className="mt-4">
          <label htmlFor="totalStudents">Total Students:</label>
          <input
            type="number"
            id="totalStudents"
            name="totalStudents"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.totalStudents}
            placeholder="Total students"
          />
          {formik.touched.totalStudents && formik.errors.totalStudents ? (
            <div className="error">{formik.errors.totalStudents}</div>
          ) : null}
        </div>

        {/* Grade Statistics */}
        {formik.values.gradeStatistics.map((gradeStat, index) => (
          <div key={index} className="flex-align-center gap-2 mt-4">
            <div>
              <label htmlFor={`grade-${index}`}>Grade:</label>
              <input
                type="text"
                id={`grade-${index}`}
                name={`gradeStatistics[${index}].grade`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gradeStatistics[index].grade}
                placeholder="e.g First Grade"
              />
              {formik.touched.gradeStatistics &&
              formik.touched.gradeStatistics[index] &&
              formik.errors.gradeStatistics &&
              formik.errors.gradeStatistics[index] &&
              formik.errors.gradeStatistics[index].grade ? (
                <div className="error">
                  {formik.errors.gradeStatistics[index].grade}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor={`numberOfStudents-${index}`}>
                Number of Students:
              </label>
              <input
                type="number"
                id={`numberOfStudents-${index}`}
                name={`gradeStatistics[${index}].numberOfStudents`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.gradeStatistics[index].numberOfStudents}
                placeholder="Number of students"
              />
              {formik.touched.gradeStatistics &&
              formik.touched.gradeStatistics[index] &&
              formik.errors.gradeStatistics &&
              formik.errors.gradeStatistics[index] &&
              formik.errors.gradeStatistics[index].numberOfStudents ? (
                <div className="error">
                  {formik.errors.gradeStatistics[index].numberOfStudents}
                </div>
              ) : null}
            </div>

            {/* Option to remove a grade input field */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeGradeField(index)}
                className="p-3 rounded-full bg-slate-200 hover:bg-slate-300 mt-4"
              >
                <FiX />
              </button>
            )}
          </div>
        ))}

        {/* Button to add a new grade input field */}
        <button
          type="button"
          className="px-5 py-2 ring-2 ring-primary shadow shadow-primary/40 rounded-md text-primary mt-4"
          onClick={addGradeField}
        >
          Add Grade
        </button>

        {/* Best Students */}
        <div className="mt-8 ">
          <h1 className="text-3xl font-semibold pb-3 border-b border-b-slate-300">
            Best Students
          </h1>
          <div className="mt-4">
            {formik.values.bestStudents.map((bestStudent, index) => (
              <div key={index} className="flex-align-center gap-x-2">
                <div>
                  <label htmlFor={`name-${index}`}>Name:</label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    name={`bestStudents[${index}].name`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={bestStudent.name}
                    placeholder="Student's Name"
                  />
                  {formik.touched.bestStudents &&
                  formik.touched.bestStudents[index] &&
                  formik.errors.bestStudents &&
                  formik.errors.bestStudents[index] &&
                  formik.errors.bestStudents[index].name ? (
                    <div className="error">
                      {formik.errors.bestStudents[index].name}
                    </div>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={`gradeScore-${index}`}>Grade Score:</label>
                  <input
                    type="text"
                    id={`gradeScore-${index}`}
                    name={`bestStudents[${index}].gradeScore`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={bestStudent.gradeScore}
                    placeholder="Student's Grade Score"
                  />
                  {formik.touched.bestStudents &&
                  formik.touched.bestStudents[index] &&
                  formik.errors.bestStudents &&
                  formik.errors.bestStudents[index] &&
                  formik.errors.bestStudents[index].gradeScore ? (
                    <div className="error">
                      {formik.errors.bestStudents[index].gradeScore}
                    </div>
                  ) : null}
                </div>

                {/* Image */}
                <div className="relative mt-4">
                  <label htmlFor={`image-${index}`}>
                    <input
                      type="file"
                      id={`image-${index}`}
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        uploadImage(file, index);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    <img
                      src={`${
                        bestStudent.imageUrl
                          ? bestStudent.imageUrl
                          : "/images/coverphoto.png"
                      }`}
                      alt=""
                      className="w-14 h-14 rounded-full my-4 cursor-pointer object-cover"
                      ref={imageRef}
                    />
                  </label>
                  <div
                    className={`absolute -top-1 -right-1 border-2 border-white bg-red-500 hover:opacity-80 text-white h-9 w-9 rounded-full sm:cursor-pointer hidden place-items-center ${
                      bestStudent.imageUrl && "!grid"
                    }`}
                    onClick={() => deleteImage(bestStudent.imageUrl, index)}
                  >
                    <FiTrash />
                  </div>

                  <div className="mt-2">
                    {formik.touched.bestStudents &&
                    formik.touched.bestStudents[index] &&
                    formik.errors.bestStudents &&
                    formik.errors.bestStudents[index] &&
                    formik.errors.bestStudents[index].imageUrl ? (
                      <div className="error">
                        {formik.errors.bestStudents[index].imageUrl}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-2 flex-align-center gap-x-2">
                  {progress[index] > 0 && progress[index] < 100 && (
                    <>
                      <div className="relative h-2 w-20 bg-gray-300 rounded-full">
                        <div
                          className="absolute h-2 bg-green-500 rounded-full"
                          style={{ width: `${progress[index]}%` }}
                        />
                      </div>
                      <p>{progress[index].toFixed(0)}%</p>
                    </>
                  )}
                </div>

                {/* Option to remove a best student field */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeBestStudentField(index)}
                    className="p-3 rounded-full bg-slate-200 hover:bg-slate-300 mt-4"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}

            {/* Button to add a new best student field */}
            <button
              type="button"
              className="px-5 py-2 ring-2 ring-primary shadow shadow-primary/40 rounded-md text-primary mt-4"
              onClick={addBestStudentField}
            >
              Add Best Student
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button type="submit" disabled={formik.isSubmitting} className="btn">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};
export default EditUnebStatsForm;
