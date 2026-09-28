import { Navigate, Route, Routes } from "react-router-dom";
import CalendariosPage from "./pages/CalendariosPage";
import TiposEventoPage from "./pages/TiposEventoPage";
import CitasAgendadasPage from "./pages/CitasAgendadasPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/calendarios" replace />} />
      <Route path="/calendarios" element={<CalendariosPage />} />
      <Route path="/tipos-de-evento" element={<TiposEventoPage />} />
      <Route path="/citas-agendadas" element={<CitasAgendadasPage />} />
      <Route path="*" element={<Navigate to="/calendarios" replace />} />
    </Routes>
  );
}
