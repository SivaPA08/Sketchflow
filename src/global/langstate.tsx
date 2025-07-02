import { create } from "zustand";

type LangState={
    lang:string;
    setlang:(newlang:string)=>void;
}
const useLangStore=create<LangState>((set)=>({
    lang:'none',
    setlang:(newlang)=>set({lang:newlang})
}))

export default useLangStore;