 "use client"
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
 import {jokeTypes, tones, topics} from "@/utils/data";


export default function Chat() {
  const { messages, isLoading, append } = useChat();
  const [isReady, setIsReady] = useState(false);
  const [shouldRenderParameters, setShouldRenderParameters] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const [selectedJokeType, setSelectedJokeType] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number>(0.5);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedTopic && selectedTone && selectedJokeType) {
      setIsReady(true);
    }
  }, [selectedTopic, selectedTone, selectedJokeType]);

  const generateJoke = () => {
    if (!selectedTopic || !selectedTone || !selectedJokeType || !shouldRenderParameters) {
      setShouldRenderParameters(true);
      return;
    }
    setShouldRenderParameters(false);

    const selectedTopicLabel = topics.find((topic) => topic.value === selectedTopic)?.label || 'unknown topic';
    const selectedToneLabel = tones.find((tone) => tone.value === selectedTone)?.label || 'unknown tone';
    const selectedJokeTypeLabel = jokeTypes.find((jokeType) => jokeType.value === selectedJokeType)?.label || 'unknown joke type';

    const prompt = `Generate a ${selectedJokeTypeLabel} joke about ${selectedTopicLabel} with a ${selectedToneLabel} tone.`;
       append({ role: "user", content: prompt},{options:{body:{temperature:temperature}}});
  };

  const renderTopicsDropDown = () => (
      <select
          className="block w-full mt-1 h-10  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option value="" selected disabled hidden>
          Choose your topic
        </option>
        {topics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
        ))}
      </select>
  );

  const renderTonesDropDown = () => (
      <select
          className="block w-full mt-1 h-10  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          onChange={(e) => setSelectedTone(e.target.value)}
      >
        <option value="" selected disabled hidden>
          Choose your tone
        </option>
        {tones.map((tone) => (
            <option key={tone.value} value={tone.value}>
              {tone.label}
            </option>
        ))}
      </select>
  );

  const renderJokeTypesDropDown = () => (
      <select
          className="block w-full mt-1 h-10  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          onChange={(e) => setSelectedJokeType(e.target.value)}
      >
        <option value="" selected disabled hidden>
          Choose your joke type
        </option>
        {jokeTypes.map((jokeType) => (
            <option key={jokeType.value} value={jokeType.value}>
              {jokeType.label}
            </option>
        ))}
      </select>
  );

    const renderTemperatureSlider = () => (
        <div className="flex items-center justify-between">
            <label className="mr-2">Temperature:</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
            />
            <span className="ml-2">{temperature}</span>
        </div>
    );


    return (
      <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
        <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>

          {messages.map((m) => (
              <div
                  key={m.id}
                  className={`whitespace-pre-wrap text-white ${
                      m.role === "user"
                          ? "bg-green-700 p-3 m-2 rounded-lg"
                          : "bg-slate-700 p-3 m-2 rounded-lg"
                  }`}
              >
                {m.role === "user" ? "User: " : "AI: "} {m.content}
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
              {shouldRenderParameters && (
                  <div className="mb-5">
                      {renderTopicsDropDown()}
                      {renderTonesDropDown()}
                      {renderJokeTypesDropDown()}
                      {renderTemperatureSlider()}
                  </div>
              )}
            {
              <button
                  className={`${
                      isLoading || !isReady ? "bg-gray-500" : "bg-blue-500"
                  } p-2 text-white rounded shadow-xl`}
                  disabled={isLoading || !isReady}
                  onClick={generateJoke}
              >
                {shouldRenderParameters
                    ? "Generate The Best Joke Ever"
                    : "Generate Another Joke"}
              </button>
            }
          </div>
        </div>
      </div>
  );
}
