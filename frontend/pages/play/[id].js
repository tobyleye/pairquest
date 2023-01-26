import { useRouter } from "next/router";
import { Room } from "../../components/multiplayer/room";

export default function () {
  const { query } = useRouter();
  const roomId = query.id;

  return <Room roomId={roomId} />;
}
