// SummarizeForm.js
import  { useState } from 'react';
import axios from 'axios';

const SummarizeForm = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/summarize/', { text });
            setSummary(response.data.summary);
        } catch (error) {
            console.error('There was an error summarizing the text!', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    rows="10"
                    cols="50"
                    placeholder="Enter Japanese text here"
                />
                <button type="submit">Summarize</button>
            </form>
            {summary && (
                <div>
                    <h2>Summary:</h2>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default SummarizeForm;
