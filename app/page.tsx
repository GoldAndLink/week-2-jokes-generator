"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

const topics = [
  {
    label: "Work",
    value: "work",
  },
  {
    label: "People",
    value: "people",
  },
  {
    label: "Animals",
    value: "animals",
  },
  {
    label: "Food",
    value: "food",
  },
  {
    label: "Television",
    value: "television",
  },
];

export default function Chat() {
  const {
    messages,
    isLoading,
    append,
  } = useChat();

  const [isReady, setIsReady] = useState(false);
  const [shouldRenderParameters, setShouldRenderParameters] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null); // Duplicate this line for other parameters

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedTopic) { // Add other parameters here selectedTopic && selectedTone && ...etc.
      setIsReady(true);
    }
  }, [selectedTopic]);

  const generateJoke = () => {
    if (!selectedTopic) { // Add other parameters here !selectedTopic || !selectedTone || ...etc.
      return;
    }

    if (!shouldRenderParameters) {
      setShouldRenderParameters(true);
      return;
    }

    setShouldRenderParameters(false);

    append({ role: "user", content: `Generate a random joke about ${selectedTopic}` });
  };

  const renderTopicsDropDown = () => (
    <select 
      className="block w-full mt-1 h-10 bg-blue-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
      onChange={(e) => setSelectedTopic(e.target.value)}
    >
      <option value="" selected disabled hidden>Choose your topic</option>
      {topics.map((topic) => (
        <option key={topic.value} value={topic.value}>
          {topic.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
      <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
        {shouldRenderParameters && (
          <div className="mb-5">
            {renderTopicsDropDown()}
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
              }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-center items-center h-screen">
            <div className="loader">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-5 w-full max-w-md">
        <div className="flex flex-col justify-center mb-2 items-center">
          {<button
              className={`${isLoading || !isReady ? "bg-gray-500" : "bg-blue-500"} p-2 text-white rounded shadow-xl`}
              disabled={isLoading || !isReady}
              onClick={generateJoke}
            >
              {shouldRenderParameters ? "Generate The Best Joke Ever" : "Generate Another Joke"}
            </button>}
        </div>
      </div>
    </div>
  );
}
