import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* You can add more routes here as you build out your application */}
    </Routes>
  );
};

export default App;
