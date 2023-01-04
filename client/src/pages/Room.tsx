import { useParams } from "react-router-dom";

const Room = () => {
  const { id } = useParams();
  console.log(id);
  return <div></div>;
};

export default Room;
