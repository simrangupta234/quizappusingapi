import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const [quesNum, setQuesNum] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [data, setData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [randomIndex, setRandomIndex] = useState(0);
  // const [allOptions, setAllOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  
  const handleSubmit = () => {
    const nextQues = currentQuestion + 1;
    if (nextQues < 10) {
      setShowScore(false);
      setIsDisabled(false);
      setCurrentQuestion(nextQues);
      setQuesNum(quesNum + 1);
      setRandomIndex(Math.floor(Math.random() * 4));
    } else {
      setShowScore(true);
    }
  };

  const handleOptionClick = (option, e) => {
    if (data.results[currentQuestion].correct_answer === option) {
      setScore(score + 10);
      e.target.style.backgroundColor = "green";
    } else {
      e.target.style.backgroundColor = "red";
    }
    setIsDisabled(true);
  };

  const allOptions = () => {
    const incorrectAnswers = [
      ...data.results[currentQuestion].incorrect_answers,
    ];

    // console.log("randomIndex: ", randomIndex);
    incorrectAnswers.splice(
      randomIndex,
      0,
      data.results[currentQuestion].correct_answer
    );
    return incorrectAnswers;
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
    )
      .then((response) => response.json())
      .then((d) => {
        setData(d);

        setIsLoading(false);
        console.log(d);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className=" d-flex justify-content-center align-items-center h-100 w-100 bg-info">
      {isLoading ? (
        <div>
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className=" card d-flex flex-column justify-content-center align-items-center p-5 w-50 bg-white">
          {showScore ? (
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h1>Your score is {score}.</h1>
              <a href="/" className="btn btn-dark w-75 m-1">
                Play Again
              </a>
            </div>
          ) : (
            <div className=" d-flex flex-column justify-content-center align-items-center ">
              <h1 className=" fw-semibold">Quiz App</h1>

              <div className="question m-2 ">
                <h5>
                  <b>({quesNum}/10). </b>
                  {
                  data.results[currentQuestion].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'") }
                </h5>
              </div>
              <div className="options d-flex flex-column justify-content-center align-items-center w-100">
                {data.results &&
                  allOptions().map((option) => (
                    <button
                      id={option}
                      key={option}
                      disabled={isDisabled}
                      className="options btn w-75 m-1 text-wrap border border-black"
                      onClick={(e) => {
                        handleOptionClick(option, e);
                      }}
                    >
                      {option.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
                    </button>
                  ))}
              </div>

              <button
                className="submit btn btn-dark w-75 m-1"
                onClick={() => {
                  handleSubmit();
                }}
              >
                submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
