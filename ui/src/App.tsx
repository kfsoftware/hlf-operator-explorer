import { Outlet } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default App;
