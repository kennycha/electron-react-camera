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

  