const rooms = () => {
  let roomList = [];

  function getList() {
    return roomList;
  }
  return { getList };
};

const users = () => {
  let connectedUserList = [];

  function getList() {
    return connectedUserList;
  }
  return { getList };
};

module.exports = {
  rooms,
  users,
};
