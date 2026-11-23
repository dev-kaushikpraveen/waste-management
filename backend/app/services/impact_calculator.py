from app.core.config import settings

class ImpactCalculator:
    """
    Environmental sustainability calculations using validated conversion factors
    """
    @staticmethod
    def calculate_co2_savings(plastic_type: str, weight_kg: float) -> float:
        ptype = plastic_type.upper()
        if "PET" in ptype:
            factor = settings.CO2_SAVED_PER_KG_PET
        elif "HDPE" in ptype:
            factor = settings.CO2_SAVED_PER_KG_HDPE
        elif "METAL" in ptype:
            factor = settings.CO2_SAVED_PER_KG_METAL
        elif "PAPER" in ptype or "CARDBOARD" in ptype:
            factor = settings.CO2_SAVED_PER_KG_PAPER
        else:
            factor = 1.5 # standard mixed plastic/dry waste factor
        return round(weight_kg * factor, 2)

    @staticmethod
    def calculate_trees_equivalent(co2_saved_kg: float) -> float:
        # 1 mature tree absorbs ~21.7 kg CO2 per year
        return round(co2_saved_kg / 21.7, 2)

    @staticmethod
    def calculate_landfill_space_diverted(weight_kg: float) -> float:
        # Avg uncompacted plastic density in landfill is ~450 kg/m3
        return round(weight_kg / 450.0, 3)

    @staticmethod
    def calculate_reward_points(material_type: str, weight_kg: float) -> int:
        mtype = material_type.upper()
        if "PET" in mtype or "PLASTIC" in mtype:
            rate = settings.POINTS_PER_KG_PLASTIC
        elif "METAL" in mtype:
            rate = settings.POINTS_PER_KG_METAL
        elif "PAPER" in mtype:
            rate = settings.POINTS_PER_KG_PAPER
        else:
            rate = 10
        return max(5, int(weight_kg * rate))

impact_calculator = ImpactCalculator()
