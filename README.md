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

  ```
  
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

- 