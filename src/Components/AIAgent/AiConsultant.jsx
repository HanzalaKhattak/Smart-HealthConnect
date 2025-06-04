import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';

const AiConsultant = () => {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBV5KK7R3BdsVEOtGB-3YcGp08eYabCE_U" });
  const [chat, setChat] = useState([
    { role: 'model', content: 'Hello!, What are the symptoms happening to you.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalSuggestion, setFinalSuggestion] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedChat = [...chat, userMessage];

    setChat(updatedChat);
    setInput('');
    setLoading(true);

    // Convert chat to Gemini's format
    // const geminiFormatted = updatedChat.map((msg) => ({
    //   role: msg.role,
    //   parts: [{ text: msg.content }],
    // }));

    try {
      const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: updatedChat.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });
  console.log(response.text);
      const data = await response.text;

      const reply = data;
      const aiMessage = { role: 'model', content: reply };
      const newChat = [...updatedChat, aiMessage];
      setChat(newChat);
      setLoading(false);

      const doctorTypes = ['dentist', 'cardiologist', 'dermatologist', 'physician', 'neurologist', 'ENT', 'pediatrician'];
      const match = doctorTypes.find((doc) => reply.toLowerCase().includes(doc));

      if (match) {
        setFinalSuggestion(`✅ You should visit a ${match}.`);
      }

    } catch (err) {
      console.error(err);
      setChat([...updatedChat, { role: 'model', content: 'Something went wrong with the AI.' }]);
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">🧠 AI Medical Assistant (Gemini)</h1>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-green-100 text-gray-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className="italic text-sm text-center text-gray-500">AI is thinking...</p>}
      </div>

      {finalSuggestion ? (
        <div className="mt-4 text-green-600 text-center text-xl font-semibold">
          {finalSuggestion}
        </div>
      ) : (
        <form onSubmit={sendMessage} className="flex mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600">Send</button>
        </form>
      )}
    </div>
  );
};

export default AiConsultant;
