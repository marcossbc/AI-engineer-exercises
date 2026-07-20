'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md mx-auto py-24">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <strong>{message.role === 'user' ? 'User: ' : 'AI: '}</strong>

          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return (
                  <p key={index} className="mt-1 whitespace-pre-wrap">
                    {part.text}
                  </p>
                );

              case 'tool-weather':
                // Weli output ma iman
                if (part.state !== 'output-available') {
                  return (
                    <div
                      key={index}
                      className="mt-2 rounded-lg bg-gray-200 p-3 text-black"
                    >
                      ⏳ Loading weather...
                    </div>
                  );
                }

                // Output waa diyaar
                return (
                  <div
                    key={index}
                    className="mt-2 rounded-lg bg-blue-100 p-3 text-black"
                  >
                    <p>📍 Location: {part.output.location}</p>
                    <p>🌡️ Temperature: {part.output.temperature}°F</p>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!input.trim()) return;

          sendMessage({
            text: input,
          });

          setInput('');
        }}
      >
        <input
          className="fixed bottom-5 w-full max-w-md rounded border p-2 shadow red:bg-zinc-900"
          value={input}
          placeholder="Ask about the weather..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}