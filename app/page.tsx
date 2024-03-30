"use client"
import { useChat } from 'ai/react';
import { jokeTypes, tones, topics } from '@/utils/data';
import { Parameters, DropdownProps, TemperatureSliderProps } from '@/utils/types';
import { useEffect, useRef, useState } from "react";

// Custom hook for joke generation logic
function useJokeGenerator() {
  const { messages, isLoading, append } = useChat();
  const [parameters, setParameters] = useState<Parameters>({
    selectedTopic: null,
    selectedTone: null,
    selectedJokeType: null,
    shouldRenderParameters: true,
    temperature: 0.5,
  });

  const updateParameter = (key: keyof Parameters, value: string | number | boolean) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const { selectedTopic, selectedTone, selectedJokeType } = parameters;
    const isReady = !!(selectedTopic && selectedTone && selectedJokeType);
    // setIsReady is removed as it is not used anywhere in the code
  }, [parameters]);

  const generateJoke = () => {
    const { selectedTopic, selectedTone, selectedJokeType, shouldRenderParameters, temperature } = parameters;
    if (!selectedTopic || !selectedTone || !selectedJokeType || !shouldRenderParameters) {
      updateParameter('shouldRenderParameters', true);
      return;
    }
    updateParameter('shouldRenderParameters', false);

    const selectedTopicLabel = topics.find(topic => topic.value === selectedTopic)?.label || 'unknown topic';
    const selectedToneLabel = tones.find(tone => tone.value === selectedTone)?.label || 'unknown tone';
    const selectedJokeTypeLabel = jokeTypes.find(jokeType => jokeType.value === selectedJokeType)?.label || 'unknown joke type';

    const prompt = `Generate a ${selectedJokeTypeLabel} joke about ${selectedTopicLabel} with a ${selectedToneLabel} tone.`;
    append({ role: 'user', content: prompt }, { options: { body: { temperature: temperature } } });
  };
  async function evaluateJoke(joke) {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ joke }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate the joke');
    }

    // Handling streaming response
    const reader = response.body.getReader();
    let chunks = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks += new TextDecoder().decode(value);
    }

    return chunks; // Returning the accumulated text
  }


  const evaluateLastJoke = async () => {
    if (messages.length === 0) {
      console.error("No joke to evaluate");
      return;
    }
    const lastMessage = messages[messages.length - 1].content;
    try {
      const evaluation = await evaluateJoke(lastMessage); // Assumes last message is the joke
      // append({ role: 'system', content: `Evaluation: ${evaluation}` });
    } catch (error) {
      console.error("Failed to evaluate the joke", error);
      append({ role: 'system', content: "Failed to evaluate the joke." });
    }
  };

  return { parameters, updateParameter, generateJoke, evaluateLastJoke, messages, isLoading };
}

// Dropdown Component
const Dropdown: React.FC<DropdownProps> = ({ id, label, options, onChange }) => (
  <div className="mt-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      onChange={(e) => onChange(e.target.value)}
      defaultValue=""
    >
      <option value="" disabled>
        Select your {label.toLowerCase()}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ temperature, setTemperature }) => (
  <div className="flex items-center justify-between my-4">
    <label htmlFor="temperature" className="mr-2 text-sm font-medium text-gray-700">
      Temperature:
    </label>
    <input
      id="temperature"
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={temperature}
      onChange={(e) => setTemperature(parseFloat(e.target.value))}
      className="w-full h-2 bg-stone-600 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
    <span className="ml-2 text-sm text-gray-500">{temperature.toFixed(1)}</span>
  </div>
);

export default function Chat() {
  const { parameters, updateParameter, generateJoke, evaluateLastJoke, messages, isLoading } = useJokeGenerator();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
      <div className="flex flex-col h-screen">
        <h1 className="flex items-center justify-center p-4 font-black text-6xl text-gray-950">Joke Generator</h1>
        <div ref={messagesContainerRef}
             className="flex-grow overflow-auto mb-4 p-4 max-w-lg mx-auto rounded-lg ">
          {messages.map((m, index) => {
            const isEvaluation = m.content.startsWith('Evaluation:');
            const messageClasses = isEvaluation
                ? 'p-3 m-2 rounded-lg bg-green-500 text-white dark:bg-green-700' // Evaluation styling
                : `p-3 m-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white dark:bg-blue-700' : 'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`; // Regular styling
            return (
                <div key={index} className={messageClasses}>
                  {m.role === 'user' ? 'You: ' : 'AI: '} {m.content}
                </div>
            );
          })}
        </div>
        {isLoading && <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>}
        <section className="w-2/3 mx-auto justify-center items-center dark:text-stone-800">
          <div className="py-4 shadow-xl ">
            {parameters.shouldRenderParameters && (
                <div className="space-y-4 p-4">
                  <Dropdown id="topic" label="Topic" options={topics}
                            onChange={(value) => updateParameter('selectedTopic', value)}/>
                  <Dropdown id="tone" label="Tone" options={tones}
                            onChange={(value) => updateParameter('selectedTone', value)}/>
                  <Dropdown id="jokeType" label="Joke Type" options={jokeTypes}
                            onChange={(value) => updateParameter('selectedJokeType', value)}/>
                  <TemperatureSlider temperature={parameters.temperature}
                                     setTemperature={(value) => updateParameter('temperature', value)}/>
                </div>
            )}
            <div className='flex justify-between gap-2 p-4 items-center'>
              <button
                  className={`mt-4 px-4 py-2 font-semibold text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isLoading}
                  onClick={generateJoke}
              >
                Generate Joke
              </button>
              <button
                  className={`mt-4 px-4 py-2 font-semibold text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={isLoading || messages.length === 0}
                  onClick={evaluateLastJoke}
              >
                Evaluate Joke
              </button>
            </div>
          </div>
        </section>
      </div>
  );
}
