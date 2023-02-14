import "./answer.scss";
import deleteImg from "../../assets/images/delete.svg";
import { Answer as answerType } from "../../hooks/useRoom";
import { LikeButton } from "../LikeButton/LikeButton";
import { User } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { database } from "../../services/firebase";
import { FaPen } from "react-icons/fa";
import { FormEvent, useState } from "react";
import { FormAnswer } from "../FormAnswer/FormAnswer";
import { useAuth } from "../../hooks/useAuth";

type propsAnswer = {
  answers: answerType[];
  user: User | undefined;
  roomId: string | undefined;
};

export const Answer = ({ answers, user, roomId }: propsAnswer) => {
  const location = useLocation();
  const { updateAnswers, setUpdateAnswers } = useAuth();
  const [newAnswer, setNewAnswer] = useState("");
  const [editAnswer, setEditAnswer] = useState(false);
  const [answerId, setAnswerId] = useState("");

  function showFormEdit(answerId: string) {
    setAnswerId(answerId);
    setEditAnswer(!editAnswer);
  }

  async function handleDeleteAnswer(answerId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta resposta?"))
      await database.ref(`/rooms/${roomId}/answers/${answerId}`).remove();
      setUpdateAnswers(!updateAnswers);
  }

  async function handleUpdateAnswer(e: FormEvent) {
    e.preventDefault();
    if (!newAnswer || !answerId) {
      return;
    }

    await database
      .ref(`/rooms/${roomId}/answers/${answerId}`)
      .update({ content: newAnswer.trim() });
    setNewAnswer("");
    setEditAnswer(false);
    setUpdateAnswers(!updateAnswers);
  }

  return (
    <div className="answers-list">
      {answers.map((answer) => {
        return (
          <div className="answers" key={answer.id}>
            <div className="author-answer-info">
              <img src={answer.author.avatar} alt={answer.author.name} />
              <span>{answer.author.name}</span>
            </div>
            <div className="answer-content">
              {!editAnswer ? (
                <>
                  <p>{answer.content}</p>
                  {location.pathname === `/rooms/${roomId}` ? (
                    <LikeButton answer={answer} user={user} roomId={roomId} />
                  ) : (
                    <div className="answer-menu">
                      <button
                        type="button"
                        onClick={() => handleDeleteAnswer(answer.id)}
                      >
                        <img src={deleteImg} alt="Deletar resposta" />
                      </button>
                      <span
                        onClick={() => {
                          showFormEdit(answer.id);
                        }}
                      >
                        <FaPen color="#4f4f5a" />
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {editAnswer && answerId === answer.id ? (
                    <FormAnswer
                      key={answer.id}
                      answer={answer}
                      newAnswer={newAnswer}
                      setNewAnswer={setNewAnswer}
                      onSubmit={handleUpdateAnswer}
                      setEditAnswer={setEditAnswer}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
