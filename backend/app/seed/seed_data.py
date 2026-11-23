from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.entities import (
    User, UserRoleEnum, Bin, IoTDevice, WasteBatch, BatchEvent, 
    BatchStatusEnum, RewardsWallet, MarketplaceListing
)
from app.services.qr_service import qr_service

def seed_initial_data():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return # Already seeded

        print("Seeding initial EcoTrace 360 database with realistic test accounts...")

        # 1. Five Core User Roles
        users_data = [
            ("citizen@ecotrace.org", "EcoCitizen2026!", "Aarav Sharma", UserRoleEnum.CITIZEN, "IIT Delhi", "Karakoram Hostel"),
            ("collector@ecotrace.org", "EcoCollector2026!", "Vikram Singh", UserRoleEnum.COLLECTOR, None, None),
            ("recycler@ecotrace.org", "EcoRecycler2026!", "EcoPolymer Recycling Ltd", UserRoleEnum.RECYCLER, None, None),
            ("admin@ecotrace.org", "EcoAdmin2026!", "Dr. Priya Nair", UserRoleEnum.ADMIN, None, None),
            ("superadmin@ecotrace.org", "EcoSuperAdmin2026!", "Chief Architect Admin", UserRoleEnum.SUPER_ADMIN, None, None),
        ]

        created_users = {}
        for email, pwd, name, role, college, hostel in users_data:
            u = User(
                email=email,
                hashed_password=get_password_hash(pwd),
                full_name=name,
                role=role,
                is_active=True,
                is_verified=True,
                college_name=college,
                hostel_name=hostel
            )
            db.add(u)
            db.commit()
            db.refresh(u)
            created_users[email] = u

            # Wallet for citizen
            if role == UserRoleEnum.CITIZEN:
                wallet = RewardsWallet(user_id=u.id, balance_points=320, lifetime_points=480, tier="Silver EcoWarrior")
                db.add(wallet)
                db.commit()

        # 2. Smart Bins across Campus
        bins_data = [
            ("BIN-DEL-01", "Main Cafeteria Bin A", 28.5458, 77.1926, "Near Student Center", "Hostel Zone", 85.0, 38.5, "COLLECTION_NEEDED"),
            ("BIN-DEL-02", "Central Library Smart Bin", 28.5442, 77.1910, "Library Plaza Ground Floor", "Academic Block", 42.0, 18.0, "ACTIVE"),
            ("BIN-DEL-03", "Sports Complex Recycler", 28.5475, 77.1945, "Athletics Arena Gate 2", "Sports Complex", 94.0, 48.0, "OVERFLOW"),
            ("BIN-DEL-04", "Engineering Block B Bin", 28.5430, 77.1895, "Computer Science Foyer", "Academic Block", 25.0, 11.2, "ACTIVE"),
            ("BIN-DEL-05", "Hostel Alpha Entrance", 28.5480, 77.1880, "Hostel Quadrangle", "Hostel Zone", 78.0, 35.0, "COLLECTION_NEEDED"),
        ]

        for code, name, lat, lon, addr, area, fill, wt, st in bins_data:
            b = Bin(
                bin_code=code,
                name=name,
                latitude=lat,
                longitude=lon,
                address=addr,
                area=area,
                current_fill_percent=fill,
                current_weight_kg=wt,
                status=st
            )
            db.add(b)
            db.commit()
            db.refresh(b)

            # IoT Device Mapping
            dev = IoTDevice(
                device_uid=f"ESP32-{code}",
                bin_id=b.id,
                mac_address="24:6F:28:B4:9C:12",
                firmware_version="v2.1.0-Release",
                status="ONLINE"
            )
            db.add(dev)
            db.commit()

        # 3. Seed Sample Digital Plastic Passport Batches
        batch_1_code = "ECO-PET-2026-000001"
        qr_1 = qr_service.generate_qr_data_uri(f"https://ecotrace360.org/track/{batch_1_code}")
        batch_1 = WasteBatch(
            batch_code=batch_1_code,
            plastic_type="PET plastic",
            source_location="Main Cafeteria Bin A",
            source_type="SMART_BIN_COLLECTION",
            initial_weight_kg=125.0,
            received_weight_kg=124.2,
            processed_weight_kg=118.5,
            status=BatchStatusEnum.PROCESSED,
            collector_id=created_users["collector@ecotrace.org"].id,
            recycler_id=created_users["recycler@ecotrace.org"].id,
            qr_code_url=qr_1
        )
        db.add(batch_1)
        db.commit()
        db.refresh(batch_1)

        # Batch 1 Events Timeline
        events = [
            (BatchStatusEnum.CREATED, "Main Cafeteria Bin A", "Batch created from sorted smart bin collection.", 125.0),
            (BatchStatusEnum.COLLECTED, "Main Cafeteria Bin A", "Loaded onto Electric Collection Truck DL-01-EV-4421.", 125.0),
            (BatchStatusEnum.IN_TRANSIT, "Transit Route Sector 4", "En route to EcoPolymer Recycling Plant.", 125.0),
            (BatchStatusEnum.RECEIVED, "EcoPolymer Plant Bay 3", "Weighed at weighbridge: 124.2 kg (moisture loss: 0.8 kg).", 124.2),
            (BatchStatusEnum.SORTED, "Optical Sorting Line 2", "Sorted and optical contaminant removal complete.", 122.0),
            (BatchStatusEnum.PROCESSING, "High-temp Wash & Hot Shredder", "Converted to uniform 8mm washed clean flakes.", 120.0),
            (BatchStatusEnum.PROCESSED, "Pelletizing Extruder Unit", "Certified 118.5 kg Grade-A rPET recycled pellets ready for remanufacture.", 118.5),
        ]
        for st, loc, note, wt in events:
            e = BatchEvent(
                batch_id=batch_1.id,
                status=st,
                actor_id=created_users["recycler@ecotrace.org"].id,
                actor_role="Certified Facility",
                location=loc,
                notes=note,
                recorded_weight_kg=wt
            )
            db.add(e)
        db.commit()

        # Batch 2: In transit
        batch_2_code = "ECO-HDPE-2026-000002"
        qr_2 = qr_service.generate_qr_data_uri(f"https://ecotrace360.org/track/{batch_2_code}")
        batch_2 = WasteBatch(
            batch_code=batch_2_code,
            plastic_type="HDPE plastic",
            source_location="Hostel Alpha Entrance",
            source_type="CITIZEN_PICKUP",
            initial_weight_kg=84.0,
            status=BatchStatusEnum.IN_TRANSIT,
            collector_id=created_users["collector@ecotrace.org"].id,
            qr_code_url=qr_2
        )
        db.add(batch_2)
        db.commit()
        db.refresh(batch_2)

        # 4. Marketplace Listings
        listings = [
            ("Clean Washed rPET Flakes - Grade A", "PET Flakes", 500.0, 52.0, "Grade A - Food Contact Safe", "Okhla Industrial Phase II", "Hot-washed, moisture <0.5%, zero PVC contamination. Lab certified."),
            ("Recycled HDPE Granules - Injection Grade", "HDPE", 350.0, 68.0, "Grade B+ Heavy Duty", "EcoPolymer Facility", "Ideal for manufacturing industrial pallets, conduits, and recycled bins.")
        ]
        for title, mtype, qty, pr, gr, loc, desc in listings:
            ml = MarketplaceListing(
                seller_id=created_users["recycler@ecotrace.org"].id,
                title=title,
                material_type=mtype,
                quantity_available_kg=qty,
                price_per_kg=pr,
                quality_grade=gr,
                location=loc,
                description=desc
            )
            db.add(ml)
        db.commit()

        print("Database successfully seeded with realistic EcoTrace 360 data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
