type firebaseRoomType = Record<
    string,    
    {
        authorId: string;
    }
>;

export type roomType = {
    id: string,
    authorId: string;
}
 

export default firebaseRoomType;
