import { User } from "../contexts/AuthContext";
import { Answer, Question } from "../hooks/useRoom";

type propsQuestionList = {
    roomId: string | undefined;
    questions: Question[];
    user?: User | undefined
    answers: Answer[];
};

export default propsQuestionList
  