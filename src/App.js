import React from "react";
import styled from "styled-components";
// import WebcamStreamCapture from "./WebcamStreamCapture";
import WebcamCapture from "./WebcamCapture";

const Title = styled.h1`
  text-align: center;
`;

function App() {
  return (
    <>
      <Title>Electron React App with Camera</Title>
      <WebcamCapture />
      {/* <WebcamStreamCapture /> */}
    </>
  );
}

export default App;
