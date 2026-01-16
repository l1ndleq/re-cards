import { useEffect, useState } from "react";
import { socket } from "./net";

export default function App() {
  const [code, setCode] = useState("");
  const [seat, setSeat] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    socket.on("room_created", (m) => { setCode(m.code); setSeat(m.seat); });
    socket.on("room_joined", (m) => { setCode(m.code); setSeat(m.seat); });
    socket.on("state", (s) => setLog(s.log ?? []));
    socket.on("error_msg", (e) => setErr(e.message));
    return () => {
      socket.off("room_created"); socket.off("room_joined");
      socket.off("state"); socket.off("error_msg");
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Re Cards</h1>
      {err && <div style={{ color: "crimson" }}>Error: {err}</div>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => socket.emit("create_room")}>Create room</button>
        <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ROOM CODE" />
        <button onClick={() => socket.emit("join_room", { code })}>Join room</button>
        <div>Seat: {seat ?? "-"}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => socket.emit("action", { code, payload: { t: "PING", at: Date.now(), from: seat } })}
          disabled={!code}
        >
          Send action
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Log</h3>
        <pre style={{ background: "#111", color: "#0f0", padding: 12, borderRadius: 8 }}>
          {log.join("\n")}
        </pre>
      </div>
    </div>
  );
}
