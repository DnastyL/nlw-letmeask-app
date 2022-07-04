import "./question.scss";
import { ReactNode } from "react";
import cx from "classnames";
import answerImg from "../../assets/images/answer.svg";
import verifiedImg from "../../assets/images/questionVerified.svg"

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
};

export const Questions = ({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false,
}: QuestionProps) => {
  
  return (
    <div
      className={cx(
        "question",
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <div className="question-content">
        <div className="question-text">
          <p>{content}</p>
        </div>
        <div className="text-verification">
          {isAnswered && !isHighlighted ? (
            <>
              <p>Respondida</p>
              <img src={answerImg} alt="Pergunta respondida" />
            </>
          ) : (
            ""
          )}

          {isHighlighted && !isAnswered ? (
            <>
              <p>Verificada</p>
              <img src={verifiedImg} alt="Pergunta verificada" />
            </>
          ) : (
            ""
          )}

          {isHighlighted && isAnswered ? (
            <>
              <p>Respondida e Verificada  </p>
              <img src={verifiedImg} alt="Pergunta verificada" />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
};
