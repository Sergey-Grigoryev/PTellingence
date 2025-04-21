import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PTIntakeUI from "./pages/PTIntakeUI";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PTIntakeUI />} />
      </Routes>
    </Router>
  );
}

export default App;