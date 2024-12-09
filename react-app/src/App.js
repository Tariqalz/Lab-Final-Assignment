import './App.css';
import Bookmark from './components/Bookmark.js';
import Footer from './components/Footer.js';


function App() {
  return (
    <div className="container">
      <Bookmark />
      <Footer year={2024} />
    </div>
  );
}

export default App;
