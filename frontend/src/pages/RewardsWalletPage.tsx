import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Wallet, RewardTransaction, LeaderboardUser } from '../types';
import { Award, Gift, TrendingUp, CheckCircle2, Trophy, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsWalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);

  useEffect(() => {
    api.getWallet().then(setWallet).catch(() => {});
    api.getTransactions().then(setTransactions).catch(() => {});
    api.getLeaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  const handleRedeem = (couponTitle: string, cost: number) => {
    if (wallet && wallet.balance_points >= cost) {
      setWallet((prev) => prev ? { ...prev, balance_points: prev.balance_points - cost } : null);
      setRedeemedCoupon(couponTitle);
      confetti({ particleCount: 60, spread: 60 });
    }
  };

  const coupons = [
    { title: 'Campus Cafeteria 20% Discount Voucher', cost: 100, desc: 'Valid at student dining hall and campus cafes' },
    { title: 'College Bookstore $10 Book Grant', cost: 200, desc: 'Usable for academic stationery and textbooks' },
    { title: 'Zero-Waste Bamboo Cutlery & Steel Bottle Kit', cost: 350, desc: 'Eco-certified durable sustainable kit' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <Award className="h-3.5 w-3.5 text-[#7CB342]" /> Gamified Recycling Economy
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Green Rewards Wallet & Gamification
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Every kilogram of verified plastic, metal, and dry waste earns green points redeemable for sustainable campus incentives.
        </p>
      </div>

      {/* Wallet Card */}
      <div className="saahas-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400">Verified Rewards Balance</span>
          <div className="text-4xl font-black text-[#003620] mt-1 flex items-baseline gap-2">
            {wallet?.balance_points || 320} <span className="text-lg font-bold text-[#005A36]">Points</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Lifetime Earned: <span className="font-bold text-slate-800">{wallet?.lifetime_points || 480} pts</span> • Rank: Tier 2
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-center">
          <div className="text-xs font-bold text-[#005A36]">Citizen Eco Tier</div>
          <div className="text-lg font-black text-[#003620]">{wallet?.tier || 'Silver EcoWarrior'}</div>
          <div className="text-[11px] text-slate-500">Next Tier at 500 pts (+180 pts left)</div>
        </div>
      </div>

      {/* Rewards Store & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Coupons */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-black text-[#003620] flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#005A36]" /> Redeemable Green Incentives
          </h2>

          {redeemedCoupon && (
            <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center justify-between shadow-soft">
              <span>Success! Redeemed: {redeemedCoupon}</span>
              <span className="font-mono text-xs bg-white px-2.5 py-1 rounded-lg text-[#005A36] border border-[#C8E6C9]">
                CODE: ECO-GIFT-2026
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl saahas-card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{c.title}</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9] shrink-0">
                      {c.cost} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{c.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeem(c.title, c.cost)}
                  disabled={(wallet?.balance_points || 0) < c.cost}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs disabled:opacity-40 transition-all shadow-soft"
                >
                  {(wallet?.balance_points || 0) >= c.cost ? 'Redeem Voucher' : 'Insufficient Points'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Leaderboard */}
        <div className="saahas-card p-6">
          <h2 className="text-base font-black text-[#003620] mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" /> EcoWarrior Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((u) => (
              <div
                key={u.rank}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  u.rank === 1
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-[#F8FAF9] border-[#E0EAE3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.rank === 1
                        ? 'bg-amber-500 text-white shadow-soft'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{u.rank}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{u.user_name}</div>
                    <div className="text-[10px] text-slate-400">{u.college_name || 'Campus'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#005A36]">{u.total_points} pts</span>
                  <div className="text-[10px] text-slate-400">{u.total_waste_kg} kg waste</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
