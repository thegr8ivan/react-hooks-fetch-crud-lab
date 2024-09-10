// QuestionItem.js
import React from "react";

function QuestionItem({ question, onDelete, onCorrectAnswerChange }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  const handleDelete = () => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => onDelete(id)) // Notify parent to remove question
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleCorrectAnswerChange = (event) => {
    onCorrectAnswerChange(id, parseInt(event.target.value, 10));
  };

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={correctIndex} onChange={handleCorrectAnswerChange}>
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
