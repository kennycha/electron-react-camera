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
