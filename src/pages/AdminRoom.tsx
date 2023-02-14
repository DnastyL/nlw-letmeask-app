import { useParams } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";
import { Header } from "../components/Header/Header";
import RoomParams from "../types/RoomParams";
import { useDark } from "../hooks/useDark";
import { QuestionListAdm } from "../components/QuestionListAdm/QuestionListAdm";
import { useAuth } from "../hooks/useAuth";
import { useCallback, useEffect } from "react";
import { database } from "../services/firebase";

export function AdminRoom() {
  const { user, setAdmin } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions, answers } = useRoom(roomId);
  const { dark } = useDark();

  const verificationRoom = useCallback(async () => {
    const ref = await database.ref(`rooms/${roomId}`).get();
    const onwerRoom = ref.val().authorId;

    if (user?.id === onwerRoom) {
      return;
    }

    setAdmin(false);
    sessionStorage.removeItem("admin");
  }, [roomId, user?.id, setAdmin]);

  useEffect(() => {
    verificationRoom().catch(console.error);
  }, [verificationRoom]);

  return (
    <div id="page-room" className={dark ? "dark" : ""}>
      <Header roomId={roomId} params={params} />
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <QuestionListAdm
          roomId={roomId}
          questions={questions}
          answers={answers}
          user={user}
        />
      </main>
    </div>
  );
}
