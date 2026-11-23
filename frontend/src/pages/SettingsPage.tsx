import React, { useState } from 'react';
import { Settings, Sliders, Bell, Shield, Database, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [pointsPerKg, setPointsPerKg] = useState(20);
  const [overflowThreshold, setOverflowThreshold] = useState(80);
  const [mqttHeartbeat, setMqttHeartbeat] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <Settings className="h-3.5 w-3.5 text-[#7CB342]" /> System Configurations
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Platform Configuration & System Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Adjust smart bin sensor thresholds, green reward conversion multipliers, and MQTT telemetry intervals.
        </p>
      </div>

      <div className="saahas-card p-6 space-y-6">
        {saved && (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center gap-2 shadow-soft">
            <CheckCircle2 className="h-4 w-4" /> Platform settings updated and synchronized with database!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Green Points Multiplier (Points per kg of Plastic)
            </label>
            <input
              type="number"
              value={pointsPerKg}
              onChange={(e) => setPointsPerKg(parseInt(e.target.value))}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36] font-semibold"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Default conversion: 20 points per kg of verified rPET/HDPE waste.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Smart Dustbin Overflow Alarm Threshold (%)
            </label>
            <input
              type="number"
              value={overflowThreshold}
              onChange={(e) => setOverflowThreshold(parseInt(e.target.value))}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36] font-semibold"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Ultrasonic fill percentage at which automated collector dispatch alarms trigger.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              MQTT Sensor Telemetry Heartbeat Interval (Seconds)
            </label>
            <input
              type="number"
              value={mqttHeartbeat}
              onChange={(e) => setMqttHeartbeat(parseInt(e.target.value))}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36] font-semibold"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Frequency of ESP32 ultrasonic and load cell telemetry packets.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Configuration Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
