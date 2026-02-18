import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Connect from "./pages/Connect";
import MyHackathons from "./pages/MyHackathons";
import Profile from "./pages/Profile";
import CreateHackathon from "./pages/CreateHackathon";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="connect" element={<Connect />} />
          <Route path="myhackathons" element={<MyHackathons />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create" element={<CreateHackathon />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
