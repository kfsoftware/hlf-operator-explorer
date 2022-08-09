import { Outlet } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";

function Base() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default Base;
