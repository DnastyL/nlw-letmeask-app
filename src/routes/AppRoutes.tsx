import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AdminRoom } from "../pages/AdminRoom";
import { Home } from "../pages/Home";
import { NewRoom } from "../pages/NewRoom";
import { Room } from "../pages/Room";

export const AppRoutes = () => {
  const { user, admin } = useAuth();


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {!!user && (
        <>
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {admin && (
        <>
          <Route path="/:admin/rooms/:id" element={<AdminRoom />} />
          <Route path="*" element={<Navigate to="/:admin/rooms/:id" />} />
        </>
      )}
    </Routes>
  );
};
