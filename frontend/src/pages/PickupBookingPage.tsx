import React, { useState } from 'react';
import { api } from '../services/api';
import { CalendarCheck, MapPin, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PickupBookingPage: React.FC = () => {
  const [category, setCategory] = useState('Dry Recyclable Plastics');
  const [weight, setWeight] = useState(2.5);
  const [address, setAddress] = useState('Room 214, Karakoram Hostel');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [timeSlot, setTimeSlot] = useState('Morning (9 AM - 12 PM)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createPickup({
        waste_category: category,
        estimated_weight_kg: weight,
        pickup_address: address,
        contact_phone: phone,
        preferred_time_slot: timeSlot
      });
      setSuccess(`Pickup booked! Request Code: ${res.request_code}`);
    } catch (e: any) {
      alert(e.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <CalendarCheck className="h-3.5 w-3.5 text-[#7CB342]" /> Doorstep Service
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Book On-Demand Doorstep Collection
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Schedule an on-demand doorstep collection by campus electric waste collection vehicles.
        </p>
      </div>

      <div className="saahas-card p-6">
        {success && (
          <div className="mb-4 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center gap-2 shadow-soft">
            <CheckCircle2 className="h-5 w-5 text-[#005A36]" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Waste Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
            >
              <option value="Dry Recyclable Plastics">Dry Recyclable Plastics (PET / HDPE)</option>
              <option value="Cardboard & Paper">Cardboard & Paper Waste</option>
              <option value="Metal Cans & Foil">Metal Cans & Aluminium</option>
              <option value="Electronic Waste">Small E-Waste</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              required
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address</label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
            >
              <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
              <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
              <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105"
          >
            {isSubmitting ? 'Confirming Dispatch...' : 'Confirm Doorstep Collection'}
          </button>
        </form>
      </div>
    </div>
  );
};
