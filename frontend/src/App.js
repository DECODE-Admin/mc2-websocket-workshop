import Polls from './Polls';
import Vote from './Vote';
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Polls />} />
            <Route path="/vote/:id" element={<Vote />} />
        </Routes>
      );
}

export default App;
