import { useCallback, useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

export type Question = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export type Answer = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  questionId: string;
  likeCount: number;
  likeId: string | undefined;
};

export type firebaseAnswers = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    questionId: string;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;



export function useRoom(roomId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [title, setTitle] = useState("");
  const { user, updateQuestions, updateAnswers } = useAuth();

  const parseFirebaseQuestions = useCallback(
    (firebaseQuestions: FirebaseQuestions) => {
      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      return parsedQuestions;
    },
    [user?.id]
  );

  const parseFirebaseAnswers = useCallback(
    (firebaseAnswers: firebaseAnswers) => {
      const parsedAnswers = Object.entries(firebaseAnswers).map(
        ([key, value]) => {
          return {
            id: key,
            author: value.author,
            content: value.content,
            questionId: value.questionId,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id
            )?.[0],
          };
        }
      );
      return parsedAnswers;
    },
    [user?.id]
  );

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();


      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

    
      const parsedQuestions = parseFirebaseQuestions(firebaseQuestions);

      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      
    });
    return () => {
      roomRef.off("value");
    };
  }, [roomId, user?.id, parseFirebaseQuestions, updateQuestions]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseAnswers: firebaseAnswers = databaseRoom.answers ?? {};
      const parsedAnswers = parseFirebaseAnswers(firebaseAnswers);


      setAnswers(parsedAnswers);
    });
    return () => {
      roomRef.off("value");
    };
  },[roomId, user?.id, parseFirebaseAnswers, updateAnswers])


  return { questions, title, answers };
}
