import { ChatType, RoomType } from "../types";
import { useCallback, useEffect, useState } from "react";

import { useAppSelector } from "../store/hooks";
import useSocket from "../hooks/useSocket";

const ChatBox = ({ room }: { room: RoomType }) => {
  const [chatHistoryList, setChatHistoryList] = useState<ChatType[]>([]);
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const { on, emit } = useSocket();
  const [chat, setChat] = useState<string>("");

  const updateHistory = useCallback(
    (newHistory: ChatType) => {
      setChatHistoryList([...chatHistoryList, newHistory]);
    },
    [chatHistoryList]
  );

  useEffect(() => {
    if (on) {
      on("user-disconnected", ({ currentUser }) => {
        const newHistory: ChatType = {
          chat: "방을 떠났다",
          type: "noti",
          userNickname: currentUser.userNickname,
        };
        updateHistory(newHistory);
      });
      on("user-connected", ({ currentUser }) => {
        const newHistory: ChatType = {
          chat: "방을 드러왔다.",
          type: "noti",
          userNickname: currentUser.userNickname,
        };
        updateHistory(newHistory);
      });

      on("receive-chat", ({ userNickname, message }) => {
        const newHistory: ChatType = {
          chat: message,
          type: "chat",
          userNickname,
        };
        updateHistory(newHistory);
      });
    }
  }, [on, updateHistory]);

  const handleChatSubmitClick = () => {
    emit("send-chat", chat, room);
    setChat("");
  };

  return (
    <div>
      <div>
        {chatHistoryList.map((chatHistory, i) => (
          <p
            key={i}
            style={{ color: chatHistory.type === "noti" ? "red" : "black" }}
          >
            {chatHistory.userNickname}: {chatHistory.chat}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={chat}
        onChange={(e) => setChat(e.target.value)}
      />
      <button onClick={handleChatSubmitClick}>채팅보내기</button>
    </div>
  );
};

export default ChatBox;
