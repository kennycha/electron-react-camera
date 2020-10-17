# Electron React with Camera

- Init with CRA

  ```bash
  $ npx create-react-app electron-react-camera
  ```

- electron 설치

  ```bash
  $ npm i -D electron electron-builder
  ```

- 기타 개발 도구

  ```bash
  $ npm i electron-is-dev
  ```

  - `electron-is-dev` : Electron이 개발 환경에서 실행 중인지 확인

  ```bash
  $ npm i -D concurrently wait-on cross-env
  ```

  - `concurrently` : 여러 명령어를 병렬적으로 실행할 수 있게 도와주는 명령어
  - `wait-on` : 특정 포트, 파일, HTTP 자원 등이 활성화될 때까지 기다려주는 크로스 플랫폼 명령어
  - `cross-env` : 프로그램을 CLI 환경에서 실행시킬 때에 Windows, Linux, macOS 등 OS에 관계없이 동일한 문장으로 환경변수를 설정할 수 있게 도와주는 명령어

- `public/electron.js` 파일 생성

  ```js
  const { app, BrowserWindow } = require("electron");
  const isDev = require("electron-is-dev");
  const path = require("path");
  
  let mainWindow;
  
  const createWindow = () => {
    mainWindow = new BrowserWindow({
      // window 옵션
      width: 1920,
      height: 1080,
  
      webPreferences: {
        // node 환경처럼 사용
        nodeIntegration: true,
      },
    });
  
    if (isDev) {
      // 개발 중에는 로컬 호스트에서 로드
      mainWindow.loadURL("http://localhost:3000");
      // 개발자 도구 연 상태로 로드
      mainWindow.webContents.openDevTools();
    } else {
      // 배포 시 패키지 내부 리소스에 접근
      mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
    }
  
    // window event-handler
    mainWindow.on("closed", () => {
      mainWindow = undefined;
    });
  };
  
  // app event-handlers
  app.on("ready", createWindow);
  
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  
  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
  ```

- `package.json` 파일 수정

  ```json
  {
  	...,
      "main": "public/electron.js",
  	"homepage": "./",
      "scripts": {
      	"react-start": "react-scripts start",
  	    "react-build": "react-scripts build",
  	    "react-test": "react-scripts test",
  	    "react-eject": "react-scripts eject",
  	    "start": "concurrently \"cross-env BROWSER=none npm run react-start\" \"wait-on http://localhost:3000 && electron .\"",
  	    "build": "npm run react-build && electron-builder",
  	    "release": "npm run react-build && electron-builder --publish=always"
    	},
  	...
  }
  ```

  - `"main": "public/electron.js"`
    - 프로그램 시작점을 public 폴더 내 electron.js 파일로 설정
  - scripts
    - `start` : 디버그 및 개발 용도
      - `concurrently` 패키지를 통해, 브라우저 표시 없이 React를 실행하는 명령과, `http://localhost:3000`에 React가 활성화 되기를 기다린 후 Electron을 실행하는 명령을 병렬적으로 단축
    - `build` : `dist` 폴더에 실행 파일 생성
    - `release` : `dist` 폴더에 실행 파일 생성 및 배포

- 개발 환경 실행

  ```bash
  $ npm run start
  ```

- 실행 파일 생성

  ```bash
  $ npm run build
  ```

- `react-webcam` 추가

  - 설치

    ```bash
    $ npm i react-webcam
    ```

  - 적용

    ```jsx
    import React from "react";
    import Webcam from "react-webcam";
    import styled from "styled-components";
    
    const Title = styled.h1`
      text-align: center;
    `;
    
    const WebcamBlock = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    
    function App() {
      return (
        <>
          <Title>Electron React with Camera</Title>
          <WebcamBlock>
            <Webcam />
          </WebcamBlock>
        </>
      );
    }
    
    export default App;
    
    ```

- screenshot 생성

  ```jsx
  import React, { useCallback, useRef } from "react";
  import Webcam from "react-webcam";
  
  const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const capture = useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc.slice(0, 30));
    }, [webcamRef]);
  
    return (
      <>
        <WebcamBlock>
          <Webcam 
            mirrored={true} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" />
        </WebcamBlock>
        <button onClick={capture}>Capture Photo</button>
      </>
    );
  };
  ```

  - `useCallback`
    - memoization 된 콜백을 반환
      - `webcamRef` 가 변경될 경우에만 변경
    - `useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 동일
  - `useRef`
    - `useRef`는 `.current` 프로퍼티로 전달된 인자(`initialValue`)로 초기화된 변경 가능한 ref 객체를 반환
    - 일반적으로 자식에게 명령적으로 접근하는 경우 사용

- video 캡쳐

  ```jsx
  import React, { useCallback, useRef, useState } from "react";
  import Webcam from "react-webcam";
  import styled from "styled-components";
  
  const WebcamBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const WebcamStreamCapture = () => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
  
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
  
    const handleStartCaptureClick = useCallback(() => {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);
  
    const handleDataAvailable = useCallback(
      ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => prev.concat(data));
        }
      },
      [setRecordedChunks]
    );
  
    const handleStopCaptureClick = useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);
  
    const handleDownload = useCallback(() => {
      if (recordedChunks.length) {
        const blob = new Blob(recordedChunks, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      }
    }, [recordedChunks]);
  
    return (
      <>
        <WebcamBlock>
          <Webcam audio={false} ref={webcamRef} />
        </WebcamBlock>
        {capturing ? (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )}
      </>
    );
  };
  
  export default WebcamStreamCapture;
  ```

  - [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)

    - The MediaStream Recording API makes it possible to capture the data generated by a `MediaStream` or `HTMLMediaElement` object for analysis, processing, or saving to disk
    - The MediaStream Recording API is comprised of a single major interface, `MediaRecorder`, which does all the work of taking the data from a `MediaStream` and delivering it to you for processing
    - The data is delivered by a series of `dataavailable` events, already in the format you specify when creating the `MediaRecorder`. You can then process the data further or write it to file as desired

  - [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

    - The `MediaRecorder` interface of the MediaStream Recording API provides functionality to easily record media. 

    -  `MediaRecorder()` constructor

      - 생성 시 `mimeType` 을 `video/webm` 으로 설정

        ```jsx
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm",
        });
        ```

    - methods

      - `MediaRecorder.pause()` : Pauses the recording of media.
      - `MediaRecorder.requestData()` : Requests a `Blob` containing the saved data received thus far (or since the last time `requestData()` was called. After calling this method, recording continues, but in a new `Blob`.
      - `MediaRecorder.resume()` : Resumes recording of media after having been paused.
      - `MediaRecorder.start()` : Begins recording media; this method can optionally be passed a `timeslice` argument with a value in milliseconds. If this is specified, the media will be captured in separate chunks of that duration, rather than the default behavior of recording the media in a single large chunk.
      - `MediaRecorder.stop()` : Stops recording, at which point a `dataavailable` event containing the final `Blob` of saved data is fired. No more recording occurs.

    - event handlers

      - `MediaRecorder.ondataavailable`
        - Called to handle the `dataavailable` event, which is periodically triggered each time `timeslice` milliseconds of media have been recorded (or when the entire media has been recorded, if `timeslice` wasn't specified). 
        - The event, of type `BlobEvent`, contains the recorded media in its `data` property. 
        - You can then collect and act upon that recorded media data using this event handler.