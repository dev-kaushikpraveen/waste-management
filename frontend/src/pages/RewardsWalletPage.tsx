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
    { title: 'Corporate Partner Eco-Dining Voucher', cost: 100, desc: 'Valid at zero-waste cafeteria networks and green retail' },
    { title: 'Zero-Waste Certified Bamboo & Steel Kit', cost: 200, desc: 'Food-grade stainless steel bottle & reusable utensils' },
    { title: 'Carbon Offset Certificate & Tree Planting Bond', cost: 350, desc: 'Officially certified biological sequestration bond' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <Award className="h-3.5 w-3.5 text-amber-400" /> GAMIFIED CIRCULAR REWARDS
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Green Rewards Wallet & Incentives
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Every kilogram of verified plastic, metal, and dry waste earns green points redeemable for sustainable incentives.
        </p>
      </div>

      {/* Wallet Card */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Verified Rewards Balance</span>
          <div className="text-4xl font-black text-white mt-1 flex items-baseline gap-2">
            {wallet?.balance_points || 320} <span className="text-lg font-bold text-amber-400">Points</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Lifetime Earned: <span className="font-bold text-slate-200">{wallet?.lifetime_points || 480} pts</span> • Rank: Tier 2
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-900/80 border border-white/[0.08] text-center">
          <div className="text-xs font-bold text-indigo-300">Producer Eco Tier</div>
          <div className="text-lg font-black text-white">{wallet?.tier || 'Silver EcoWarrior'}</div>
          <div className="text-[10px] font-mono text-slate-500">Next Tier at 500 pts (+180 pts left)</div>
        </div>
      </div>

      {/* Rewards Store & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Coupons */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gift className="h-4 w-4 text-indigo-400" /> Redeemable Green Incentives
          </h2>

          {redeemedCoupon && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
              <span>Success! Redeemed: {redeemedCoupon}</span>
              <span className="font-mono text-xs bg-dark-900 px-2.5 py-1 rounded-lg text-emerald-400 border border-emerald-500/40">
                CODE: ECO-GIFT-2026
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl glass-panel flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-white leading-snug">{c.title}</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                      {c.cost} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{c.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeem(c.title, c.cost)}
                  disabled={(wallet?.balance_points || 0) < c.cost}
                  className="mt-4 w-full py-2.5 rounded-xl btn-primary-gradient text-xs font-bold disabled:opacity-40"
                >
                  {(wallet?.balance_points || 0) >= c.cost ? 'Redeem Incentive' : 'Insufficient Points'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* District Leaderboard */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" /> Circular Leaderboard
          </h2>

          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((u) => (
              <div
                key={u.rank}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  u.rank === 1
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-dark-900/60 border-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.rank === 1
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    #{u.rank}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{u.user_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{u.college_name || 'Metropolitan District'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-300">{u.total_points} pts</span>
                  <div className="text-[10px] text-slate-400">{u.total_waste_kg} kg diverted</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
