import React, { useState, useEffect, useCallback } from "react";
import { Button, Box } from "@mui/material";
import axios from "axios";

function VoiceRecorder(props) {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();
  const [disabled, setDisabled] = useState(true); // πππ

  const onRecAudio = () => {
    setDisabled(true); // πππ

    // μμμ λ³΄λ₯Ό λ΄μ λΈλλ₯Ό μμ±νκ±°λ μμμ μ€νλλ λμ½λ© μν€λ μΌμ νλ€
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // μλ°μ€ν¬λ¦½νΈλ₯Ό ν΅ν΄ μμμ μ§νμνμ μ§μ μ κ·Όμ μ¬μ©λλ€.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // λ΄ μ»΄ν¨ν°μ λ§μ΄ν¬λ λ€λ₯Έ μμ€λ₯Ό ν΅ν΄ λ°μν μ€λμ€ μ€νΈλ¦Όμ μ λ³΄λ₯Ό λ³΄μ¬μ€λ€.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // λ§μ΄ν¬ μ¬μ© κΆν νλ
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);

      analyser.onaudioprocess = function (e) {
        // 3λΆ(180μ΄) μ§λλ©΄ μλμΌλ‘ μμ± μ μ₯ λ° λΉμ μ€μ§
        if (e.playbackTime > 180) {
          stream.getAudioTracks().forEach(function (track) {
            track.stop();
          });
          mediaRecorder.stop();
          // λ©μλκ° νΈμΆ λ λΈλ μ°κ²° ν΄μ 
          analyser.disconnect();
          audioCtx.createMediaStreamSource(stream).disconnect();

          mediaRecorder.ondataavailable = function (e) {
            setAudioUrl(e.data);
            setOnRec(true);
          };
        } else {
          setOnRec(false);
        }
      };
    });
  };

  // μ¬μ©μκ° μμ± λΉμμ μ€μ§ νμ λ
  const offRecAudio = async () => {
    // dataavailable μ΄λ²€νΈλ‘ Blob λ°μ΄ν°μ λν μλ΅μ λ°μ μ μμ
    media.ondataavailable = async function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
      props.setVoiceUrl(e.data);
    };

    // λͺ¨λ  νΈλμμ stop()μ νΈμΆν΄ μ€λμ€ μ€νΈλ¦Όμ μ μ§
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // λ―Έλμ΄ μΊ‘μ² μ€μ§
    media.stop();

    // λ©μλκ° νΈμΆ λ λΈλ μ°κ²° ν΄μ 
    analyser.disconnect();
    source.disconnect();
    setDisabled(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {audioUrl && (
        <audio
          src={URL.createObjectURL(audioUrl)}
          controls
          controlsList="nodownload"
        />
      )}
      <Button
        sx={{
          backgroundColor: "#00ccb1",
        }}
        variant="contained"
        onClick={onRec ? onRecAudio : offRecAudio}
      >
        {onRec ? "Start" : "Stop"}
      </Button>
    </Box>
  );
}

export default VoiceRecorder;
