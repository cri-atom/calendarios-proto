import PlaceholderPage from "./PlaceholderPage";

export default function TiposEventoPage() {
  return (
    <PlaceholderPage
      title="Tipos de evento"
      subtitle="Configura los tipos de citas que los agentes pueden agendar vía WhatsApp"
      pendientes={[
        "Identificación del tipo de evento",
        "Disponibilidad one-click",
        "Límites de agendamiento",
        "Flujo de confirmación por WhatsApp",
      ]}
    />
  );
}
