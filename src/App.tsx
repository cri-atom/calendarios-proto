import { Navigate, Route, Routes } from "react-router-dom";
import CalendariosPage from "./pages/CalendariosPage";
import TiposCitaPage from "./pages/TiposCitaPage";
import CitasAgendadasPage from "./pages/CitasAgendadasPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tipos-de-cita" replace />} />
      <Route path="/tipos-de-cita" element={<TiposCitaPage />} />
      <Route path="/tipos-de-evento" element={<Navigate to="/tipos-de-cita" replace />} />
      <Route path="/calendarios" element={<CalendariosPage />} />
      <Route path="/citas-agendadas" element={<CitasAgendadasPage />} />
      <Route path="*" element={<Navigate to="/tipos-de-cita" replace />} />
    </Routes>
  );
}
