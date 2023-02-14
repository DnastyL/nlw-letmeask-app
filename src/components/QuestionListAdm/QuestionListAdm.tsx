import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";
import deleteImg from "../../assets/images/delete.svg";
import { database } from "../../services/firebase";
import { Questions } from "../Questoes/Questoes";
import propsQuestionList from "../../types/QuestionList";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export const QuestionListAdm = ({
  roomId,
  questions,
  answers,
  user,
}: propsQuestionList) => {
  const [answerId, setAnswerId] = useState("");
  const { updateQuestions, setUpdateQuestions } = useAuth();

  async function handleDeleteQuestion(questionId: string) {
    const answerFilter = answers.filter((an) => an.questionId === questionId);

    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      answerFilter.map(
        async (answer) =>
          await database.ref(`rooms/${roomId}/answers/${answer.id}`).remove()
      );
    }
  }

  async function handleHighlightQuestion(
    questionId: string,
    questionHighlighted: boolean
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !questionHighlighted,
    });
  }

  return (
    <div className="question-list">
      {questions.map((question) => {
        return (
          <Questions
            key={question.id}
            roomId={roomId}
            user={user}
            question={question}
            answers={answers}
            answerId={answerId}
            setAnswerId={setAnswerId}
          >
            <>
              <button
                type="button"
                onClick={() => {
                  handleHighlightQuestion(question.id, question.isHighlighted);
                  setUpdateQuestions(!updateQuestions);
                }}
              >
                <img src={checkImg} alt="Marcar pergunta como verificada" />
              </button>
              <button
                type="button"
                key={question.id}
                onClick={() => {
                  setAnswerId(() =>
                    question.id === answerId ? "" : question.id
                  );
                }}
              >
                <img src={answerImg} alt="Dar destaque à pergunta" />
              </button>
            </>
            <button
              type="button"
              onClick={() => {
                handleDeleteQuestion(question.id);
                setUpdateQuestions(!updateQuestions);
              }}
            >
              <img src={deleteImg} alt="Remover pergunta" />
            </button>
          </Questions>
        );
      })}
    </div>
  );
};
