import React from "react";
import { useLocation } from "react-router-dom";

const QuizResult = () => {
    const { state } = useLocation();
    const { correct_answers, total_questions, score } = state;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl">Quiz Result</h2>
            <p>Correct Answers: {correct_answers}</p>
            <p>Total Questions: {total_questions}</p>
            <p>Score: {score}%</p>
        </div>
    );
};

export default QuizResult;
