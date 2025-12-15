import React, { useMemo, useRef, useState } from "react";
import "./LiveRadioPlayer.css";

 
const STATIONS = [
  { label: "Ujyaalo FM 90.0", url: "https://stream.zeno.fm/h527zwd11uquv" },
  { label: "रेडियो अडियो", url: "https://stream.zeno.fm/fvrx47wpg0quv" },
  { label: "Thaha Khabar", url: "https://stream.zeno.fm/qe715t14gwzuv" },
  { label: "Dead God Online Radio", url: "https://stream.zeno.fm/rm0kp78k5a0uv" },
  { label: "Hamro Patro Stream 1", url: "http://streaming.hamropatro.com:8152/;" },
  { label: "Hamro Patro Stream 2", url: "http://streaming.hamropatro.com:8206/;" },
  { label: "Hamro Patro Stream 3", url: "http://streaming.hamropatro.com:8635/;"},
    { label: "TEst", url: "https://onlineradiobox.com/ping/np.audio"},
];


export default function LiveRadioPlayer({ compact = false, className = "" }) {

  const audioRef = useRef(null);
  const [stationUrl, setStationUrl] = useState(STATIONS[0].url);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("idle");

  const station = useMemo(
    () => STATIONS.find((s) => s.url === stationUrl) ?? STATIONS[0],
    [stationUrl]
  );

  const play = async () => {
    try {
      setStatus("connecting...");
      await audioRef.current?.play(); 
      setIsPlaying(true);
      setStatus("playing");
    } catch (e) {
      setIsPlaying(false);
      setStatus("blocked (click again) / failed");
      console.error(e);
    }
  };

  const stop = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);
    setStatus("stopped");
  };

  const onChangeStation = async (e) => {
    const next = e.target.value;
    setStationUrl(next);
    setStatus("idle");

    // If already playing, switch station seamlessly
    if (isPlaying) {
      setTimeout(() => play(), 0);
    }
  };

  return (
    <div className="radioMini">
      <select value={stationUrl} onChange={onChangeStation} className="radioSelect">
        {STATIONS.map((s) => (
          <option key={s.url} value={s.url}>
            {s.label}
          </option>
        ))}
      </select>

      {!isPlaying ? (
        <button className="radioBtn" onClick={play}>Play</button>
      ) : (
        <button className="radioBtn" onClick={stop}>Stop</button>
      )}
      <span className="radioStatus">{status}</span>
      <audio
        ref={audioRef}
        src={station.url}
        preload="none"
        onWaiting={() => setStatus("buffering...")}
        onPlaying={() => setStatus("playing")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
