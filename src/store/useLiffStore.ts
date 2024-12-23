// init Liff in store and save the status and user token in store
import { create } from "zustand";
import liff from "@line/liff";

interface ILiffState {
  idToken: string | null;
  isLiffReady: boolean;
  isLoggedIn: boolean;
  errorMsg: string | null;
  initLiff: () => void;
  getIDToken: () => void;
}

export const useLiffStore = create<ILiffState>((set) => ({
  idToken: null,
  isLoggedIn: false,
  isLiffReady: false,
  errorMsg: null,

  initLiff: async () => {
    try {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
      set({ isLiffReady: true });
      set({ errorMsg: null });
      liff.ready.then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        set({ isLoggedIn: liff.isLoggedIn() });
      });
    } catch (error) {
      set({
        errorMsg: error instanceof Error ? error.message : "Liff 初始化失敗",
      });
    }
  },
  getIDToken: () => {
    try {
      set({ idToken: liff.getIDToken() });
    } catch (error) {
      set({
        errorMsg: error instanceof Error ? error.message : "取得 ID Token 失敗",
      });
    }
  },
}));
