import { User } from "../contexts/AuthContext";
import { Question } from "../hooks/useRoom";

type propsQuestionList = {
    roomId: string | undefined;
    questions: Question[];
    user?: User | undefined
};

export default propsQuestionList
  