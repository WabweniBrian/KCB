import * as Yup from "yup";

// UnebStats------------------------------------------------------------------------------------------------------------
const bestStudentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  gradeScore: Yup.string().required("Grade Score is required"),
  imageUrl: Yup.string().required("Image is required"),
});

export const unebStatsValidationSchema = Yup.object().shape({
  level: Yup.string().required("Level is required"),
  totalStudents: Yup.number().required("Total students is required"),
  gradeStatistics: Yup.array()
    .of(
      Yup.object().shape({
        grade: Yup.string().required("Grade is required"),
        numberOfStudents: Yup.number().required(
          "Number of students is required"
        ),
      })
    )
    .required("At least one grade statistic is required"),
  bestStudents: Yup.array().of(bestStudentSchema),
});

// Posts------------------------------------------------------------------------------------------------------------
export const postValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  slug: Yup.string().required("Slug is required"),
  description: Yup.string().required("Description is required"),
  imageUrl: Yup.string().required("Image is required"),
  content: Yup.string().required("Content is required"),
});

// Events------------------------------------------------------------------------------------------------------------
export const eventValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  date: Yup.date().required("Date is required"),
  time: Yup.string().required("Time is required"),
  venue: Yup.string().required("Venue is required"),
  isCompleted: Yup.boolean().required("isCompleted is required"),
});

// Family ------------------------------------------------------------------------------------------------------------
export const familyValidationSchema = Yup.object({
  name: Yup.string().required("Name Required"),
  position: Yup.string().required("Position Required"),
  category: Yup.string().required("Category Required"),
});

// Clubs ------------------------------------------------------------------------------------------------------------
export const clubValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  content: Yup.string().required("Content is required"),
});

// Subjects------------------------------------------------------------------------------------------------------------
export const subjectValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

// Slides------------------------------------------------------------------------------------------------------------
export const slideValidationSchema = Yup.object().shape({
  title: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  imageUrl: Yup.string().required("Image is required"),
});
