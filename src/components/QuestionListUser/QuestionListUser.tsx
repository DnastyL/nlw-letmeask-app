import deleteImg from "../../assets/images/delete.svg";
import { database } from "../../services/firebase";
import propsQuestionList from "../../types/QuestionList";
import { LikeButton } from "../LikeButton/LikeButton";
import { Questions } from "../Questoes/Questoes";

export const QuestionListUser = ({
  roomId,
  questions,
  user,
  answers,
}: propsQuestionList) => {
  
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
  return (
    <div className="question-list">
      {questions.map((question) => {
        return (
          <Questions       
            key={question.id}
            question={question}
            answers={answers}
            roomId={roomId}
            user={user}
          >
            <LikeButton roomId={roomId} user={user} question={question} />
            {question.author.id === user?.id ? (
              <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            ) : null}
          </Questions>
        );
      })}
    </div>
  );
};
