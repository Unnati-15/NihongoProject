import  { useState } from "react";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [botResponse, setBotResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate bot response, replace with actual logic or API call
    setBotResponse(`Bot says: "I received your message: ${message}"`);
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="container mx-auto max-w-lg p-6">
      <p className="text-xl font-semibold mb-4">
        Hey..!! I am your ROBOT FRIEND. <br />
        ロボットともだちです！！
      </p>
      <p className="text-lg mb-6">
        Want to chat and talk with me at the same time ..? Let us do it!
      </p>

      <form onSubmit={handleSubmit}>
        {/* Message Input */}
        <div className="mb-6">
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your text here"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Send Button */}
        <div className="mb-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>

        {/* Bot Response */}
        <div className="mb-6">
          <textarea
            name="textarea"
            value={botResponse}
            placeholder="bot says..."
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
            disabled
          />
        </div>
      </form>
    </div>
  );
};

export default ChatBot;
