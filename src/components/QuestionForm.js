import React, { useState } from "react";

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    correctIndex: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "correctIndex" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.correctIndex < 0 || formData.correctIndex > 1) {
      alert("Correct Answer Index should be either 0 or 1.");
      return;
    }

    const newQuestion = {
      prompt: formData.prompt,
      answers: [formData.answer1, formData.answer2],
      correctIndex: formData.correctIndex,
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then(() => {
        setFormData({
          prompt: "",
          answer1: "",
          answer2: "",
          correctIndex: 0,
        });
        setSuccessMessage("Question added successfully!");
      })
      .catch((error) => console.error("Error adding question:", error));
  };

  return (
    <div>
      <h1>Add New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correct Answer Index:
          <input
            type="number"
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
            min="0"
            max="1" 
            required
          />
        </label>
        <button type="submit">Add Question</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default QuestionForm;
