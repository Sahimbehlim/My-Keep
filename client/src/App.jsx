import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SignUp, Login, Home } from "./pages/index";
import { UserProvider, useUser } from "./context/userContext";

const AppRoutes = () => {
  const { token } = useUser();

  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={token ? <Home /> : <Navigate to={"/login"} />} />

      {/* SignUp route */}
      <Route
        path="/signup"
        element={token ? <Navigate to="/" /> : <SignUp />}
      />

      {/* Login route */}
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;
