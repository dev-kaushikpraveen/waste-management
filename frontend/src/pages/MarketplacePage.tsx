import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MarketplaceListing } from '../types';
import { ShoppingBag, Tag, MapPin, CheckCircle2, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.getListings().then(setListings).catch(() => {});
  }, []);

  const handleBuy = async (listing: MarketplaceListing) => {
    try {
      const order = await api.placeOrder({
        listing_id: listing.id,
        quantity_kg: 50.0,
        shipping_address: 'Okhla Circular Industrial Hub, Gate 4'
      });
      setOrderSuccess(`Order ${order.order_code} confirmed! Total: $${order.total_amount}`);
    } catch (e: any) {
      alert(e.message || 'Order failed');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <ShoppingBag className="h-3.5 w-3.5 text-[#7CB342]" /> Circular B2B Exchange
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          B2B Recycled Feedstock Marketplace
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Connecting certified MRFs, polymer aggregators, and green packaging manufacturers with verified feedstock.
        </p>
      </div>

      {orderSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center gap-2 shadow-soft">
          <CheckCircle2 className="h-5 w-5" /> {orderSuccess}
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => (
          <div key={item.id} className="saahas-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#005A36] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C8E6C9]">
                  {item.material_type}
                </span>
                <span className="text-lg font-black text-[#003620]">
                  ${item.price_per_kg} <span className="text-xs text-slate-400">/ kg</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>

              <div className="mt-4 pt-3 border-t border-[#EAEFEA] space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Stock:</span>
                  <span className="font-bold text-slate-800">{item.quantity_available_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quality Grade:</span>
                  <span className="font-medium text-[#005A36]">{item.quality_grade}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <MapPin className="h-3 w-3 text-[#005A36]" /> {item.location}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleBuy(item)}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105"
            >
              Order Sample Batch (50 kg)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
