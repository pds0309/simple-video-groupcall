import { UserType } from "../types";

const RoomJoinedUserList = ({
  userList,
  hostId,
}: {
  userList: UserType[];
  hostId: string;
}) => {
  return (
    <div>
      <h2>참여자목록</h2>
      <div>
        {userList.map((user) => (
          <p key={user.userId}>
            * {user.userNickname} : {user.userId}
            {user.userId === hostId && "(방장)"}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RoomJoinedUserList;
