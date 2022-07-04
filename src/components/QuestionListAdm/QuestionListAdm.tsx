import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";
import deleteImg from "../../assets/images/delete.svg";
import { database } from "../../services/firebase";
import { Questions } from "../Questoes/Questoes";
import propsQuestionList from "../../types/QuestionList";

export const QuestionListAdm = ({
  roomId,
  questions,
}: propsQuestionList) => {
  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  return (
    <div className="question-list">
      {questions.map((question) => {
        return (
          <Questions
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
          >
            {!question.isAnswered && (
              <>
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answerImg} alt="Dar destaque à pergunta" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              <img src={deleteImg} alt="Remover pergunta" />
            </button>
          </Questions>
        );
      })}
    </div>
  );
};
