import { useEffect } from "react";
import Router from "./routes";
import { useLiffStore } from "./store/useLiffStore";

// Temp
function App() {
  const { initLiff, isLiffReady, errorMsg } = useLiffStore();
  useEffect(() => {
    initLiff();
  }, []);
  // TODO:  Style 錯誤訊息 && 初始化中
  if (errorMsg) {
    return <div>{errorMsg}</div>;
  }

  if (!isLiffReady) {
    return <div>LIFF 初始化中...</div>;
  }

  return (
    <>
      <Router />
    </>
  );
}

export default App;
