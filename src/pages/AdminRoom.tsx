import { useParams } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";
import { Header } from "../components/Header/Header";
import RoomParams from "../types/RoomParams";
import { useDark } from "../hooks/useDark";
import { QuestionListAdm } from "../components/QuestionListAdm/QuestionListAdm";

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const { dark } = useDark();

  return (
    <div id="page-room" className={dark ? "dark" : ""}>
      <Header roomId={roomId} params={params} />
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <QuestionListAdm roomId={roomId} questions={questions} />
      </main>
    </div>
  );
}
