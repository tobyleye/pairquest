import { useState } from "react";
import { GameSettings } from "../components/game-settings";
import { SinglePlayerGame } from "../components/singleplayer/game";

export default function Page() {
  const [settings, setSettings] = useState(null);

  const resetSettings = () => setSettings(null);

  return (
    <>
      {settings ? (
        <SinglePlayerGame settings={settings} resetSettings={resetSettings} />
      ) : (
        <GameSettings setSettings={setSettings} />
      )}
    </>
  );
}
