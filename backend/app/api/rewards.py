from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.entities import RewardsWallet, RewardTransaction, User, WasteSubmission
from app.schemas.all_schemas import WalletResponse, RewardTransactionResponse, LeaderboardUser
from app.api.auth import get_current_user

router = APIRouter(prefix="/rewards", tags=["Rewards & Gamification"])

@router.get("/wallet", response_model=WalletResponse)
def get_wallet(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wallet = db.query(RewardsWallet).filter(RewardsWallet.user_id == current_user.id).first()
    if not wallet:
        wallet = RewardsWallet(user_id=current_user.id, balance_points=100, lifetime_points=100)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    return wallet

@router.get("/transactions", response_model=List[RewardTransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    wallet = db.query(RewardsWallet).filter(RewardsWallet.user_id == current_user.id).first()
    if not wallet:
        return []
    return db.query(RewardTransaction).filter(RewardTransaction.wallet_id == wallet.id).order_by(RewardTransaction.id.desc()).all()

@router.get("/leaderboard", response_model=List[LeaderboardUser])
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Ranks top recycling citizens by verified green points
    """
    wallets = db.query(RewardsWallet).join(User).filter(User.is_active == True).order_by(RewardsWallet.lifetime_points.desc()).limit(10).all()
    leaderboard = []
    for rank, w in enumerate(wallets, start=1):
        leaderboard.append({
            "rank": rank,
            "user_name": w.user.full_name,
            "college_name": w.user.college_name or "Tech Institute",
            "hostel_name": w.user.hostel_name or "Green Block",
            "total_points": w.lifetime_points,
            "total_waste_kg": round(w.lifetime_points / 20.0, 1)
        })
    return leaderboard
