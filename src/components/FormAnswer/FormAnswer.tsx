import { FormEvent, SetStateAction } from "react";
import { Answer as answerType } from "../../hooks/useRoom";

type FormEditType = {
  onSubmit: (e: FormEvent) => Promise<void>;
  answer?: answerType;
  setEditAnswer?: React.Dispatch<SetStateAction<boolean>>;
  newAnswer: string;
  setNewAnswer: React.Dispatch<SetStateAction<string>>;
  setAnswerId?: React.Dispatch<SetStateAction<string>> | undefined;
};

export const FormAnswer = ({
  answer,
  setEditAnswer,
  onSubmit,
  newAnswer,
  setNewAnswer,
  setAnswerId,
}: FormEditType) => {
  const answerText = !answer ? newAnswer : answer.content;

  return (
    <form className="form-answer" onSubmit={onSubmit}>
      <input
        className="class-input"
        type="text"
        autoFocus
        placeholder={answerText}
        onChange={(e) => setNewAnswer(e.target.value)}
        value={newAnswer}
      />
      <div>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => {
              !setAnswerId ? setEditAnswer!(false) : setAnswerId("")
          }}
        >
          Cancelar
        </button>
        <button
          className="btn-submit"
          disabled={
            newAnswer.length === 0 || newAnswer === answer?.content
          }
        >
          {!answer ? 'Responder' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
