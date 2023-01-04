export interface RoomType {
  roomId?: string;
  roomTitle: string;
  maxCount: number;
  hostId: string;
  hostNickname: string;
  connectedUserList: UserType[];
}

export interface UserType {
  userId: string;
  userNickname: string;
  socketId: string;
  roomId: string;
}
