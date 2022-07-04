import { Button } from "../components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/room.scss";
import { FormEvent,  useCallback,  useEffect,  useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { useRoom } from "../hooks/useRoom";
import { useDark } from "../hooks/useDark";
import { Header } from "../components/Header/Header";
import RoomParams from "../types/RoomParams";
import { QuestionListUser } from "../components/QuestionListUser/QuestionListUser";

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { user, signInWithGoogle} = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const { title, questions } = useRoom(roomId);
  const { dark } = useDark();
  const navigate = useNavigate();

  const verificationRoom = useCallback(async () => {
    const ref = await database.ref(`rooms/${roomId}`).get();
    
    if(ref.val() === null){
      return navigate(`/`)
    }  
  },[navigate, roomId])

  useEffect(() =>{
       verificationRoom()
       .catch(console.error);
  }, [verificationRoom])



  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("You must be logged in");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion("");
  }

  async function handleLogin(){
    if (!user){
      return signInWithGoogle()
    }
  }

  return (
    <div id="page-room" className={dark ? "dark" : ""}>
      <Header roomId={roomId} params={params} />
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button onClick={handleLogin}>faça seu login.</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <QuestionListUser roomId={roomId} user={user} questions={questions} />
      </main>
    </div>
  );
}
