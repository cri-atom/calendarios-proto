import { Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="relative flex h-16 shrink-0 items-center justify-between overflow-hidden bg-white px-6">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[65%]"
        style={{
          background: "linear-gradient(115deg, #333 45%, #ff6600 46%, #ff8a3d 70%, #ffd9b8 100%)",
        }}
      />
      <div className="relative flex items-center gap-6">
        <div className="flex items-center gap-1 text-2xl font-black tracking-tight text-ink">
          ATOM
        </div>
        <span className="text-xl text-muted-soft">Campañas</span>
      </div>
      <div className="relative flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={24} className="text-white" />
            <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#ff5722] text-[10px] font-medium text-white">
              0
            </span>
          </div>
          <div className="leading-tight text-white">
            <p className="text-base font-semibold">Tom Chatt</p>
            <p className="text-sm font-medium">Agente</p>
          </div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-full bg-[#0165aa] text-lg font-semibold text-white">
          TC
        </div>
      </div>
    </div>
  );
}
