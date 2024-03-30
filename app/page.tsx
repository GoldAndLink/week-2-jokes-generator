"use client"

import { useChat } from "ai/react"
import { useEffect, useRef, useState } from "react"
import { topics, tones, joketype } from "@/utils/chatdata"
import { JokeType, Tone, Topic } from "@/utils/types"

export default function Chat() {
  const { messages, isLoading, append } = useChat()

  const [isReady, setIsReady] = useState(false)
  const [shouldRenderParameters, setShouldRenderParameters] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null) // Duplicate this line for other parameters
  const [selectTone, setSelectTone] = useState<string | null>(null)
  const [selectJokeType, setSelectJokeType] = useState<string | null>(null)
  const [usedTopic, setUsedTopic] = useState<string[]>([])
  const [temperature, setTemperature] = useState<number>(0.5)

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (selectedTopic && selectTone && selectJokeType) {
      // Add other parameters here selectedTopic && selectedTone && ...etc.
      setIsReady(true)
    }
  }, [selectedTopic, selectTone, selectJokeType])
  console.log("current topics", usedTopic)
  console.log("current setTopics", selectedTopic)

  const generateJoke = () => {
    if (!shouldRenderParameters) {
      setShouldRenderParameters(true)
      return
    }

    if (!selectedTopic) {
      // Add other parameters here !selectedTopic || !selectedTone || ...etc.
      return
    }

    setShouldRenderParameters(false)
    if (usedTopic.includes(selectedTopic) && selectTone && selectJokeType) {
      append(
        {
          role: "user",
          content: `Generate another random joke about ${selectedTopic} and a ${selectTone} tone and a ${selectJokeType} joke type`,
        },
        { options: { body: { temperature: temperature } } }
      )
    } else {
      append(
        {
          role: "user",
          content: `Generate a random joke about ${selectedTopic} and a ${selectTone} tone and a ${selectJokeType} joke type`,
        },
        { options: { body: { temperature: temperature } } }
      )
    }
    setUsedTopic((prevTopics) => [...prevTopics, selectedTopic])
    setSelectedTopic(null)
  }

  const renderTopicsDropDown = () => (
    <>
      <select
        className="block w-full mt-1 h-10 bg-blue-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        onChange={(e) => setSelectedTopic(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled hidden>
          Choose your topic
        </option>
        {topics.map((topic) => (
          <option key={topic.value} value={topic.value}>
            {topic.label}
          </option>
        ))}{" "}
      </select>
      <select
        className="block w-full mt-1 h-10 bg-blue-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        onChange={(e) => setSelectTone(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled hidden>
          Choose your tone
        </option>
        {tones.map((tone) => (
          <option key={tone.value} value={tone.value}>
            {tone.label}
          </option>
        ))}{" "}
      </select>
      <select
        className="block w-full mt-1 h-10 bg-blue-500 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
        onChange={(e) => setSelectJokeType(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled hidden>
          Choose your JokeType
        </option>
        {joketype.map((joke) => (
          <option key={joke.value} value={joke.value}>
            {joke.label}
          </option>
        ))}{" "}
      </select>

      {selectedTopic && selectTone && selectJokeType && (
        <>
          <div className="relative mb-6">
            Adjust your randomness level
            <label htmlFor="labels-range-input" className="sr-only"></label>
            <input
              id="labels-range-input"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={temperature}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
              Min 0
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
              0.5
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
              Max 1
            </span>
            <div className="temp-value">{temperature}</div>
          </div>
        </>
      )}
    </>
  )

  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch">
      <div className="overflow-auto mb-8 w-full" ref={messagesContainerRef}>
        {shouldRenderParameters && (
          <div className="mb-5">{renderTopicsDropDown()}</div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap ${
              message.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
          >
            {message.role === "user" ? "User: " : "AI: "}
            {message.content}
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
  )
}
