import darklogoImg from "../../assets/images/darklogo.svg";
import logoImg from "../../assets/images/logo.svg";
import { useDark } from "../../hooks/useDark";
import { Button } from "../Button/Button";
import { RoomCode } from "../RoomCode/RoomCode";
import { useNavigate } from "react-router-dom";
import { database } from "../../services/firebase";
import RoomParams from "../../types/RoomParams";
import { useAuth } from "../../hooks/useAuth";
import ReactSwitch from "react-switch";

type HeaderProps = {
  roomId: string | undefined;
  params: Readonly<Partial<RoomParams>>;
};


export const Header = ({ roomId, params }: HeaderProps) => {
  const { insertMode, dark } = useDark();
  const { user, setAdmin} = useAuth();
  const navigate = useNavigate();

  async function handleEndRoom() {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    navigate("/");
  }

  async function handleDirectAdminRoom(){
    const ref = await database.ref(`rooms/${roomId}`).get();
    const ownerRoom = ref.val().authorId;
    if(user?.id === ownerRoom){
      navigate(`/admin/rooms/${roomId}`);
      setAdmin(true);
    }
    if(user?.id !== ownerRoom){
     alert('You need to be the room owner to enter the administration', );
    }
  }

  return (
    <header>
      <div className="content">
        <div>
          {dark ? (
            <img src={darklogoImg} alt="LetmeaskDark" />
          ) : (
            <img src={logoImg} alt="Letmeask" />
          )}
          <ReactSwitch
            onChange={insertMode}
            checked={dark}
            checkedIcon={false}
            uncheckedIcon={false}
            height={10}
            width={40}
            handleDiameter={15}
            offHandleColor={`#29292e`}
            offColor={`#835afd`}
            onColor={`#2d2f33`}
          />
        </div>
        <div className="header-div">
          <RoomCode code={roomId as string} />

          {params.admin ? (
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          ) : (
            <Button isOutlined onClick={handleDirectAdminRoom}>
              Entrar como admin
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
