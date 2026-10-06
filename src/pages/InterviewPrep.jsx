import { useState } from "react";

function InterviewPrep({ darkMode }) {
  const [showAnswer, setShowAnswer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [randomQuestion, setRandomQuestion] = useState(null);

  // Progress status for questions
  const [questionStatus, setQuestionStatus] = useState(() => {
  const savedStatus = localStorage.getItem("interviewQuestionStatus");

  return savedStatus ? JSON.parse(savedStatus) : {};
});

  const questions = [
    // =========================
    // JavaScript - 15
    // =========================

    {
      category: "JavaScript",
      question: "What is the difference between var, let and const?",
      answer:
        "var is function-scoped, while let and const are block-scoped. let allows reassignment, but const does not allow reassignment of the variable.",
    },
    {
      category: "JavaScript",
      question: "What is hoisting in JavaScript?",
      answer:
        "Hoisting is JavaScript's behavior of processing declarations before executing the code. Function declarations are available before their definition, while let and const cannot be accessed before initialization.",
    },
    {
      category: "JavaScript",
      question: "What is scope in JavaScript?",
      answer:
        "Scope determines where a variable can be accessed. Common types are global scope, function scope, and block scope.",
    },
    {
      category: "JavaScript",
      question: "What is a closure in JavaScript?",
      answer:
        "A closure happens when a function remembers and can access variables from its outer lexical scope even after the outer function has finished executing.",
    },
    {
      category: "JavaScript",
      question: "What is the difference between == and ===?",
      answer:
        "== compares values after type conversion, while === compares both value and type without automatic type conversion.",
    },
    {
      category: "JavaScript",
      question: "What is the difference between null and undefined?",
      answer:
        "undefined usually means a value has not been assigned, while null is an intentional empty or missing value.",
    },
    {
      category: "JavaScript",
      question: "What are primitive and reference types?",
      answer:
        "Primitive types include string, number, bigint, boolean, undefined, symbol, and null. Objects, arrays, and functions are reference types.",
    },
    {
      category: "JavaScript",
      question: "What is a callback function?",
      answer:
        "A callback is a function passed to another function as an argument so that it can be executed later.",
    },
    {
      category: "JavaScript",
      question: "What is the difference between map(), filter() and reduce()?",
      answer:
        "map() creates a new array by transforming elements. filter() creates a new array containing elements that satisfy a condition. reduce() combines array elements into a single result.",
    },
    {
      category: "JavaScript",
      question: "What is destructuring in JavaScript?",
      answer:
        "Destructuring allows you to extract values from arrays or properties from objects and assign them to variables.",
    },
    {
      category: "JavaScript",
      question: "What is the difference between spread and rest operators?",
      answer:
        "Both use three dots (...). Spread expands elements from an array or object, while rest collects multiple values into an array or object.",
    },
    {
      category: "JavaScript",
      question: "What is a Promise?",
      answer:
        "A Promise represents the eventual result of an asynchronous operation. It can be pending, fulfilled, or rejected.",
    },
    {
      category: "JavaScript",
      question: "What is async/await?",
      answer:
        "async/await is syntax built on Promises that makes asynchronous JavaScript easier to read and write.",
    },
    {
      category: "JavaScript",
      question: "What is the event loop?",
      answer:
        "The event loop allows JavaScript to handle asynchronous operations by coordinating the call stack, task queues, and other runtime mechanisms.",
    },
    {
      category: "JavaScript",
      question: "What is event bubbling and event capturing?",
      answer:
        "Event capturing moves an event from the outer element toward the target, while event bubbling moves the event from the target back toward its ancestors.",
    },

    // =========================
    // React - 15
    // =========================

    {
      category: "React",
      question: "What is React?",
      answer:
        "React is a JavaScript library for building user interfaces, especially component-based web applications.",
    },
    {
      category: "React",
      question: "What is a React component?",
      answer:
        "A component is a reusable piece of UI that can contain its own structure, logic, and behavior.",
    },
    {
      category: "React",
      question: "What is JSX?",
      answer:
        "JSX is a syntax extension for JavaScript that allows developers to write HTML-like UI structures inside JavaScript code.",
    },
    {
      category: "React",
      question: "What are props?",
      answer:
        "Props are read-only values passed from a parent component to a child component.",
    },
    {
      category: "React",
      question: "What is state?",
      answer:
        "State is data managed by a component that can change over time and cause the component to re-render.",
    },
    {
      category: "React",
      question: "What is the difference between props and state?",
      answer:
        "Props are passed into a component by its parent, while state is managed by the component itself.",
    },
    {
      category: "React",
      question: "What is useState()?",
      answer:
        "useState() is a React Hook used to create and manage state inside a functional component.",
    },
    {
      category: "React",
      question: "What is useEffect()?",
      answer:
        "useEffect() is a React Hook used to perform side effects such as fetching data, subscriptions, or interacting with external systems.",
    },
    {
      category: "React",
      question: "What is a dependency array?",
      answer:
        "The dependency array in useEffect() tells React when the effect should run again based on changes to the listed values.",
    },
    {
      category: "React",
      question: "What is the Virtual DOM?",
      answer:
        "The Virtual DOM is an in-memory representation of the UI that React uses to determine efficient updates to the actual DOM.",
    },
    {
      category: "React",
      question: "Why are keys used in React?",
      answer:
        "Keys help React identify which list items have changed, been added, or removed.",
    },
    {
      category: "React",
      question: "What is conditional rendering?",
      answer:
        "Conditional rendering means displaying different UI elements depending on a condition.",
    },
    {
      category: "React",
      question: "What is lifting state up?",
      answer:
        "Lifting state up means moving shared state to the closest common parent so multiple child components can use it.",
    },
    {
      category: "React",
      question: "What is prop drilling?",
      answer:
        "Prop drilling is passing data through multiple components using props even when intermediate components do not need that data.",
    },
    {
      category: "React",
      question: "What is Context API?",
      answer:
        "Context API allows data to be shared across components without manually passing props through every intermediate component.",
    },

    // =========================
    // HTML/CSS - 7
    // =========================

    {
      category: "HTML/CSS",
      question: "What is semantic HTML?",
      answer:
        "Semantic HTML uses meaningful elements such as header, nav, main, section, article, and footer to describe the structure and meaning of content.",
    },
    {
      category: "HTML/CSS",
      question: "What is the difference between div and span?",
      answer:
        "div is generally a block-level container, while span is an inline container used for smaller pieces of content.",
    },
    {
      category: "HTML/CSS",
      question: "What is the CSS Box Model?",
      answer:
        "The CSS Box Model consists of content, padding, border, and margin.",
    },
    {
      category: "HTML/CSS",
      question: "What is the difference between margin and padding?",
      answer:
        "Padding is the space inside an element between its content and border. Margin is the space outside the element's border.",
    },
    {
      category: "HTML/CSS",
      question: "What is Flexbox?",
      answer:
        "Flexbox is a CSS layout system designed to arrange and align elements efficiently in a row or column.",
    },
    {
      category: "HTML/CSS",
      question: "What is CSS Grid?",
      answer:
        "CSS Grid is a two-dimensional layout system that allows elements to be arranged in rows and columns.",
    },
    {
      category: "HTML/CSS",
      question: "What is CSS specificity?",
      answer:
        "Specificity determines which CSS rule takes priority when multiple rules target the same element.",
    },

    // =========================
    // Frontend - 3
    // =========================

    {
      category: "Frontend",
      question: "What is responsive web design?",
      answer:
        "Responsive web design makes a website adapt to different screen sizes and devices.",
    },
    {
      category: "Frontend",
      question: "What are media queries?",
      answer:
        "Media queries allow CSS rules to be applied based on conditions such as screen width, height, or device characteristics.",
    },
    {
      category: "Frontend",
      question: "What is web accessibility?",
      answer:
        "Web accessibility means designing websites so people with different abilities can use and navigate them effectively.",
    },

    // =========================
    // DSA - 10
    // =========================

    {
      category: "DSA",
      question: "What is time complexity?",
      answer:
        "Time complexity describes how the running time of an algorithm grows as the input size increases.",
    },
    {
      category: "DSA",
      question: "What is Big O notation?",
      answer:
        "Big O notation describes the upper-bound growth rate of an algorithm's time or space requirements.",
    },
    {
      category: "DSA",
      question: "What is an array?",
      answer:
        "An array is a data structure that stores multiple values in an ordered collection and allows access using indexes.",
    },
    {
      category: "DSA",
      question: "What is the difference between an array and a linked list?",
      answer:
        "Arrays store elements in indexed positions, while linked lists store nodes connected through references. Arrays generally provide faster random access.",
    },
    {
      category: "DSA",
      question: "What is a stack?",
      answer:
        "A stack is a linear data structure that follows LIFO: Last In, First Out.",
    },
    {
      category: "DSA",
      question: "What is a queue?",
      answer:
        "A queue is a linear data structure that generally follows FIFO: First In, First Out.",
    },
    {
      category: "DSA",
      question: "What is hashing?",
      answer:
        "Hashing uses a hash function to map keys to locations, allowing efficient insertion, lookup, and deletion on average.",
    },
    {
      category: "DSA",
      question: "What is binary search?",
      answer:
        "Binary search finds an element in a sorted collection by repeatedly dividing the search range in half. Its typical time complexity is O(log n).",
    },
    {
      category: "DSA",
      question: "What is the two-pointer technique?",
      answer:
        "Two pointers use two indexes that move through a data structure according to certain conditions, often reducing the need for nested loops.",
    },
    {
      category: "DSA",
      question: "What is Kadane's Algorithm?",
      answer:
        "Kadane's Algorithm finds the maximum sum of a contiguous subarray in linear time, O(n).",
    },
  ];

  const categories = [
    "All",
    "JavaScript",
    "React",
    "HTML/CSS",
    "Frontend",
    "DSA",
  ];

  // =========================
  // Search + Category Filter
  // =========================

  const filteredQuestions = questions.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const matchesSearch =
      item.question
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // =========================
  // Progress
  // =========================

  const practicedCount = Object.values(questionStatus).filter(
    (status) =>
      status === "Practiced" || status === "Confident"
  ).length;

  const confidentCount = Object.values(questionStatus).filter(
    (status) => status === "Confident"
  ).length;

  const progressPercentage = Math.round(
    (practicedCount / questions.length) * 100
  );

 function handleStatusChange(question, status) {
  setQuestionStatus((previousStatus) => {
    const updatedStatus = {
      ...previousStatus,
      [question]: status,
    };

    localStorage.setItem(
      "interviewQuestionStatus",
      JSON.stringify(updatedStatus)
    );

    return updatedStatus;
  });
}

  // =========================
  // Random Question
  // =========================

  function handleRandomQuestion() {
    if (filteredQuestions.length === 0) {
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * filteredQuestions.length
    );

    setRandomQuestion(filteredQuestions[randomIndex]);
    setShowAnswer(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2
          className={`text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Interview Prep
        </h2>

        <p
          className={`mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Practice the most important Full Stack Developer
          interview questions.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Questions */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Questions
          </p>

          <h3
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {questions.length}
          </h3>
        </div>

        {/* Practiced */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Practiced
          </p>

          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {practicedCount}
          </h3>
        </div>

        {/* Confident */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Confident
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {confidentCount}
          </h3>
        </div>

        {/* Progress */}
        <div
          className={`rounded-xl p-6 shadow-sm ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Progress
          </p>

          <h3
            className={`mt-2 text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {progressPercentage}%
          </h3>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`mb-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Interview Progress
            </h3>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {practicedCount} / {questions.length} questions practiced
            </p>
          </div>

          <span className="font-bold text-blue-600">
            {progressPercentage}%
          </span>
        </div>

        <div
          className={`mt-4 h-3 w-full overflow-hidden rounded-full ${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Search */}
      <div
        className={`mb-4 rounded-xl p-4 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <input
          type="text"
          placeholder="🔍 Search interview questions..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowAnswer(null);
          }}
          className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
              : "border-gray-300 bg-white text-gray-900"
          }`}
        />
      </div>

      {/* Random Question */}
      <div
        className={`mb-6 rounded-xl p-6 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="text-center">
          <h3
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Random Interview Question 🎯
          </h3>

          <p
            className={`mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Test yourself with a random interview question.
          </p>

          <button
            onClick={handleRandomQuestion}
            className="mt-4 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
          >
            🎲 Random Question
          </button>

          {randomQuestion && (
            <div
              className={`mt-6 rounded-lg p-5 text-left ${
                darkMode ? "bg-gray-700" : "bg-purple-50"
              }`}
            >
              <span className="rounded-full bg-purple-600 px-3 py-1 text-sm text-white">
                {randomQuestion.category}
              </span>

              <h4
                className={`mt-4 text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {randomQuestion.question}
              </h4>

              <button
                onClick={() =>
                  setShowAnswer(
                    showAnswer === randomQuestion.question
                      ? null
                      : randomQuestion.question
                  )
                }
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {showAnswer === randomQuestion.question
                  ? "Hide Answer"
                  : "Show Answer"}
              </button>

              {showAnswer === randomQuestion.question && (
                <div
                  className={`mt-4 rounded-lg border-l-4 border-blue-600 p-4 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <p className="font-semibold text-blue-600">
                    Answer
                  </p>

                  <p className="mt-2 leading-7">
                    {randomQuestion.answer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div
        className={`mb-6 rounded-xl p-4 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setShowAnswer(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div
            className={`rounded-xl p-10 text-center shadow-sm ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No questions found. 🔍
            </p>
          </div>
        ) : (
          filteredQuestions.map((item, index) => {
            const status =
              questionStatus[item.question] || "Not Attempted";

            return (
              <div
                key={item.question}
                className={`rounded-xl p-6 shadow-sm transition hover:shadow-md ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Category + Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      darkMode
                        ? "bg-blue-900/50 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {item.category}
                  </span>

                  <span
                    className={`text-sm ${
                      darkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    #{index + 1}
                  </span>
                </div>

                {/* Question */}
                <h3
                  className={`mt-4 text-lg font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.question}
                </h3>

                {/* Status */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label
                    className={`text-sm font-medium ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    Status:
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      handleStatusChange(
                        item.question,
                        e.target.value
                      )
                    }
                    className={`rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-white"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  >
                    <option value="Not Attempted">
                      Not Attempted
                    </option>

                    <option value="Practiced">
                      Practiced
                    </option>

                    <option value="Confident">
                      Confident
                    </option>
                  </select>

                  {status === "Practiced" && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                      Practiced 🟡
                    </span>
                  )}

                  {status === "Confident" && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Confident 🟢
                    </span>
                  )}
                </div>

                {/* Practice Button */}
                <button
                  onClick={() =>
                    setShowAnswer(
                      showAnswer === item.question
                        ? null
                        : item.question
                    )
                  }
                  className={`mt-4 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {showAnswer === item.question
                    ? "Hide Answer"
                    : "Practice Question"}
                </button>

                {/* Answer */}
                {showAnswer === item.question && (
                  <div
                    className={`mt-4 rounded-lg border-l-4 border-blue-600 p-4 ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-blue-50 text-gray-700"
                    }`}
                  >
                    <p className="font-semibold text-blue-600">
                      Answer
                    </p>

                    <p className="mt-2 leading-7">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default InterviewPrep;