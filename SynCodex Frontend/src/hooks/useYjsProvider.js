import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const useYjsProvider = (roomId) => {
  const yDoc = new Y.Doc();

  const serverUrl = "ws://localhost:1234"

  const provider = new WebsocketProvider(serverUrl, roomId, yDoc);

  if (provider){
    console.log("Initialized WebSocket provider for room:", roomId);
  }

  return { yDoc };
};
