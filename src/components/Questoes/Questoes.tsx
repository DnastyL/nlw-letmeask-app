import "./question.scss";
import cx from "classnames";
import verifiedImg from "../../assets/images/questionVerified.svg";
import { FormEvent, ReactNode, useState } from "react";
import { Answer as answerType, Question } from "../../hooks/useRoom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { User } from "../../contexts/AuthContext";
import { Answer } from "../Answer/Answer";
import { FormAnswer } from "../FormAnswer/FormAnswer";
import { database } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";

type QuestionProps = {
  children?: ReactNode;
  answers: answerType[];
  answerId?: string;
  setAnswerId?: React.Dispatch<React.SetStateAction<string>>;
  question: Question;
  user: User | undefined;
  roomId: string | undefined;
};

export const Questions = ({
  children,
  answers,
  answerId,
  question,
  setAnswerId,
  user,
  roomId,
}: QuestionProps) => {
  const { id, author, content, isHighlighted } = question;
  const [viewAnswers, setViewAnswers] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const { setUpdateAnswers, updateAnswers } = useAuth();

  const answersFilter = answers.filter((an) => an.questionId === id);

  async function handleSubmitAnswer(e: FormEvent) {
    e.preventDefault();

    if (newAnswer.trim() === "") {
      return;
    }
    if (!user) {
      throw new Error("You must be logged in");
    }

    const answer = {
      content: newAnswer.trim(),
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      questionId: id,
    };

    await database.ref(`rooms/${roomId}/answers`).push(answer);
    setNewAnswer("");
    setUpdateAnswers(!updateAnswers)
  }


  return (
    <>
      <div className={cx("question", { highlighted: isHighlighted })}>
        <div className="question-content">
          <div className="question-text">
            <p>{content}</p>
          </div>
          <div className="text-verification">
            {isHighlighted ? (
              <>
                <p>Verificada</p>
                <img src={verifiedImg} alt="Pergunta verificada" />
              </>
            ) : null}
          </div>
        </div>
        <footer>
          <div className="user-info">
            <img src={author.avatar} alt={author.name} />
            <span>{author.name}</span>
          </div>
          <div>{children}</div>
        </footer>
        {answersFilter.length > 0 ? (
          <div className="view-answers">
            <span onClick={() => setViewAnswers(!viewAnswers)}>
              {!viewAnswers ? (
                <FaCaretDown size={18} />
              ) : (
                <FaCaretUp size={18} />
              )}
              {answersFilter.length} respostas
            </span>
          </div>
        ) : null}
      </div>
      {id === answerId ? (
        <div className="answer-box">
          <div className="box-img">
            <img src={user?.avatar} alt={user?.name} />
          </div>
          <FormAnswer
            onSubmit={handleSubmitAnswer}
            setAnswerId={setAnswerId}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
          />
        </div>
      ) : null}
      {viewAnswers ? (
        <Answer answers={answersFilter} user={user} roomId={roomId} />
      ) : null}
    </>
  );
};
