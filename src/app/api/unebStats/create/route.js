export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { level, totalStudents, gradeStatistics } = req.body;

  try {
    // Create a new document using the FinalExamsStats model
    const examStats = new FinalExamsStats({
      level,
      totalStudents,
      gradeStatistics,
    });

    // Save the document to MongoDB
    await examStats.save();

    return res
      .status(201)
      .json({ message: "Exam statistics saved successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to save exam statistics" });
  }
}
