import React, { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const WebcamBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WebcamCapture = () => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc.slice(0, 30));
  }, [webcamRef]);

  return (
    <>
      <WebcamBlock>
        <Webcam mirrored={true} ref={webcamRef} screenshotFormat="image/jpeg" />
      </WebcamBlock>
      <button onClick={capture}>Capture Photo</button>
    </>
  );
};

export default WebcamCapture;
