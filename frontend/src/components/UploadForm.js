import React, { useState } from "react";

export default function UploadForm({ setSkills }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload a resume file.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5050/extract-skills", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract skills from resume");
      }

      const data = await response.json();
      setSkills(data.skills);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
      <button type="submit" disabled={loading}>
        {loading ? "Extracting..." : "Upload & Extract Skills"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
