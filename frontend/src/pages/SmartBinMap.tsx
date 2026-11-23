import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Bin } from '../types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Radio, BatteryCharging, AlertTriangle, RefreshCw, Cpu, Activity, Signal, ShieldCheck } from 'lucide-react';

// Custom clean marker generator based on fill level
const createBinIcon = (fill: number, status: string) => {
  let color = '#005A36'; // Green <60%
  if (fill >= 80 || status === 'OVERFLOW') color = '#DC2626'; // Red >80%
  else if (fill >= 60 || status === 'COLLECTION_NEEDED') color = '#D97706'; // Amber 60-80%

  return L.divIcon({
    className: 'custom-bin-pin',
    html: `
      <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-family: sans-serif; font-size: 11px;">
        ${Math.round(fill)}%
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export const SmartBinMap: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [filterArea, setFilterArea] = useState<string>('ALL');

  const fetchBins = () => {
    api.getBins().then((data) => {
      setBins(data);
      if (data.length > 0 && !selectedBin) setSelectedBin(data[0]);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchBins();
  }, []);

  const handleSimulateStep = async () => {
    setIsSimulating(true);
    try {
      await api.simulateIoTStep();
      fetchBins();
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredBins = filterArea === 'ALL' ? bins : bins.filter((b) => b.area === filterArea);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <Radio className="h-3.5 w-3.5 text-[#7CB342] animate-pulse" /> Live IoT Mesh Network
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
            IoT Smart Dustbin Telemetry Radar
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time ultrasonic distance fill monitoring and load cell weight sensors across campus sectors streamed via MQTT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:ring-2 focus:ring-[#005A36]"
          >
            <option value="ALL">All Campus Sectors</option>
            <option value="Hostel Zone">Hostel Zone</option>
            <option value="Academic Block">Academic Block</option>
            <option value="Sports Complex">Sports Complex</option>
          </select>

          <button
            onClick={handleSimulateStep}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Streaming...' : 'Trigger Telemetry Step'}
          </button>
        </div>
      </div>

      {/* Main Map + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map */}
        <div className="lg:col-span-2 h-[520px] rounded-3xl overflow-hidden border border-[#DDE7E1] shadow-card relative">
          <MapContainer
            center={[28.5458, 77.1926]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredBins.map((bin) => (
              <Marker
                key={bin.id}
                position={[bin.latitude, bin.longitude]}
                icon={createBinIcon(bin.current_fill_percent, bin.status)}
                eventHandlers={{
                  click: () => setSelectedBin(bin)
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-800 font-sans">
                    <div className="font-bold text-xs text-[#005A36]">{bin.name}</div>
                    <div className="text-[11px] text-slate-500">{bin.bin_code}</div>
                    <div className="text-xs font-black mt-1">Fill: {bin.current_fill_percent}%</div>
                    <div className="text-[11px]">Weight: {bin.current_weight_kg} kg</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Bin Real-time Telemetry Panel */}
        <div className="saahas-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#005A36] uppercase tracking-wider mb-2">
              Selected Node Telemetry
            </div>

            {selectedBin ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-[#003620]">{selectedBin.name}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedBin.bin_code}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedBin.address}</div>
                </div>

                {/* Ultrasonic Fill Meter */}
                <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E0EAE3]">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-600">Ultrasonic Fill Level</span>
                    <span
                      className={`font-black ${
                        selectedBin.current_fill_percent >= 80 ? 'text-red-600' : 'text-[#005A36]'
                      }`}
                    >
                      {Math.round(selectedBin.current_fill_percent)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${selectedBin.current_fill_percent}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedBin.current_fill_percent >= 80
                          ? 'bg-red-500'
                          : selectedBin.current_fill_percent >= 60
                          ? 'bg-amber-500'
                          : 'bg-[#005A36]'
                      }`}
                    />
                  </div>
                </div>

                {/* Sensor Details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E0EAE3]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Load Cell Wt</span>
                    <span className="text-base font-black text-slate-800">{selectedBin.current_weight_kg} kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAF9] border border-[#E0EAE3]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Node Battery</span>
                    <span className="text-base font-black text-[#005A36]">
                      {selectedBin.battery_level || 96.4}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#005A36] flex items-center justify-between">
                  <span className="font-bold">Status: {selectedBin.status}</span>
                  <span className="text-[10px]">{selectedBin.area}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10">Select a bin on the radar to inspect telemetry</div>
            )}
          </div>

          <div className="pt-4 border-t border-[#EAEFEA] text-[11px] text-slate-400 text-center">
            ESP32 Node updates every 10s via Mosquitto MQTT Broker.
          </div>
        </div>
      </div>
    </div>
  );
};
