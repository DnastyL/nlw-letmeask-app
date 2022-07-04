import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppRoutes/>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
