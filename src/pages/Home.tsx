import "../styles/auth.scss";
import "react-toastify/dist/ReactToastify.css";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import useModal from "../hooks/useModal";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { Modal } from "../components/Modal/Modal";
import firebaseRoomType, { roomType } from "../types/RoomType";
import { ToastContainer, toast } from "react-toastify";

export const Home = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const { toggle, isOpen } = useModal();
  const [roomCode, setRoomCode] = useState("");
  const [roomFilter, setRoommFilter] = useState<roomType[]>([]);

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    navigate("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === "") {
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      return toast.error("Rooms does not exists", { theme: "dark" });
    }

    if (roomRef.val().endedAt) {
      return toast.error("Room already closed.", {theme: "dark"});
      
    }

    navigate(`/rooms/${roomCode}`);
  }

  async function handleSearchRoom() {
    const roomRef: firebaseRoomType = await (
      await database.ref(`rooms`).get()
    ).val();

    const parsedRooms = Object.entries(roomRef)
      .filter(([key, value]) => value.authorId === user?.id)
      .map(([key, value]) => {
        return {
          id: key,
          authorId: value.authorId,
        };
      });

    setRoommFilter(parsedRooms);

    toggle();
  }

  function copyRoomCode(roomCode: string) {
    navigator.clipboard.writeText(roomCode);
    toast(`🦄 ${roomCode} copied to the clipboard!`);
  }

  async function handleDeleteRoom(roomCode: string) {
    if (window.confirm("Tem certeza que deseja excluir essa sala?")) {
      await database
        .ref(`rooms/${roomCode}`)
        .remove()
        .then(() => {
          toast.success(`Room deleted with sucess`, { theme: "dark" });
          toggle();
        })
        .catch((err) => {
          toast.error(`Failed do delete room - ${err}`);
        });
    }
  }



  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo da google" />
            Crie sua sala com o google
          </button>
          <div className="seperator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
          {user ? (
            <p>
              <strong onClick={handleSearchRoom}>
                Clique aqui para visualizar suas salas
              </strong>
            </p>
          ) : null}
          <Modal isOpen={isOpen} toggle={toggle}>
            {user && roomFilter.length > 0 ? (
              <div className="user-rooms-overlay">
                <span>
                  <h1>Sua lista de salas: </h1>
                  <span onClick={toggle} className="button-close">
                    <AiOutlineClose size={24} color="#737380" />
                  </span>
                </span>
                <ul className="user-rooms">
                  {roomFilter.map((room) => {
                    return (
                      <li key={room.id} className="room-list">
                        <p>{room.id}</p>
                        <span>
                          <Button
                            type="button"
                            isModalButton
                            onClick={() => copyRoomCode(room.id)}
                          >
                            Copiar
                          </Button>

                          <img
                            src={deleteImg}
                            alt="Delete room"
                            onClick={() => handleDeleteRoom(room.id)}
                          />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </Modal>
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </div>
  );
};
