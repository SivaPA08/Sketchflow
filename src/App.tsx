import "./App.css";
import Rectangle from "./comp/Rectangle";
export default function App() {
  return (
    <div className="bdy">
      <header className="topbar">
        <h3>SketchFlow</h3>
      </header>

      <aside className="leftbar">
        {/* left-sidebar content */}
      </aside>

      <main className="board">
        <div className="scroll-wrap">
          <Rectangle/>
          {/* Your horizontal content goes here */}
        </div>
      </main>

      <aside className="rightbar">
        {/* right-sidebar content */}
      </aside>

      <footer className="bottombar">
        <p>Copyright bro</p>
      </footer>
    </div>
  );
}
