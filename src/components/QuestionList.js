import React, { useState, useEffect } from "react";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'DELETE',
    })
      .then(() => setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id)))
      .catch(error => console.error('Error deleting question:', error));
  };

  const handleUpdate = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correctIndex }),
    })
      .then(response => response.json())
      .then(data => setQuestions(prevQuestions =>
        prevQuestions.map(question => question.id === id ? data : question)
      ))
      .catch(error => console.error('Error updating question:', error));
  };

  return (
    <div>
      <h1>Question List</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {question.prompt}
            <button onClick={() => handleDelete(question.id)}>Delete</button>
            <select
              value={question.correctIndex}
              onChange={(e) => handleUpdate(question.id, parseInt(e.target.value))}
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>{answer}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;
