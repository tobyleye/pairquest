import { useRouter } from "next/router";
import { MultiPlayerGame } from "../../components/multiplayer/game";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  return <MultiPlayerGame room={id} />;
}
