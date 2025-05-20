import { create } from "zustand";

interface InfoState {
  email: string;
  phone: string;
  // Add other general info fields here if needed
}

interface InfoActions {
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
}

const useInfoStore = create<InfoState & InfoActions>((set) => ({
  email: "info@placeholder.com",
  phone: "01234567890",

  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
}));

export default useInfoStore;
