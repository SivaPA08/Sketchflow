import "./App.css";
import "./styles/shapes.css"
import Rectangle from "./comp/Rectangle";
export default function App() {
  return (
    <div className="bdy">
      <header className="topbar">
        <h3>SketchFlow</h3>
      </header>

      <aside className="leftbar">
        <div className="mainleft">
        <div className="shapes">
          <div className="title">
            <p>Shapes</p>
          </div>
          <div className="contents">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sint ratione et sapiente repudiandae praesentium distinctio quae. Voluptatem, amet? Ea quibusdam optio mollitia quasi id vero obcaecati corporis earum culpa consequatur?</div>
        </div>

        <div className="lines">
          <div className="title">
            <p>Lines</p>
          </div>
          <div className="contents">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum a possimus minima sunt nam quas sed. Sint, reprehenderit corporis nulla reiciendis nihil temporibus fugit eveniet possimus ratione quae, rem aut.
          </div>
        </div>

        <div className="moreshapes">
          <div className="title">
            <p>More Shapes</p>
          </div>
          <div className="contents">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum a possimus minima sunt nam quas sed. Sint, reprehenderit corporis nulla reiciendis nihil temporibus fugit eveniet possimus ratione quae, rem aut.
          </div>
        </div>
        </div>
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
