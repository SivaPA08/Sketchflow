import useLangStore from "../global/langstate";
import "./style/langselect.css"
export default function Langselect() {
  const setlang = useLangStore((state) => state.setlang);
  const lang= useLangStore((state)=>state.lang);
  return (
    <div className="langselect">
      <div className="currlang"><p>family:{lang}</p></div>
      <div className="selectlang">
        <button onClick={() => setlang("Arial")}>Arial</button>
        <button onClick={() => setlang("Courier New")}>Courier</button>
        <button onClick={() => setlang("Comic Sans MS")}>Cursive</button>
        <button onClick={() => setlang("Papyrus")}>Fantasy</button>
        <button onClick={() => setlang("Times New Roman")}>Times</button>
      </div>
    </div>
  );
}
