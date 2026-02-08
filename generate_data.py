import json
import random
import csv
from datetime import datetime, timedelta

def generate_pilot_data():
    # 1. Farms and Paddocks
    farms = []
    paddocks = []
    coops = ["coop1", "coop2", "coop3"]
    
    for i in range(1, 13):
        farm_id = f"farm{i}"
        coop_id = coops[(i-1) // 4]
        farms.append({
            "id": farm_id,
            "name": f"Farm {i}",
            "coop_id": coop_id,
            "size_ha": random.randint(50, 500),
            "region": "Northern Tablelands"
        })
        
        for j in range(1, 5):
            paddocks.append({
                "id": f"{farm_id}_p{j}",
                "farm_id": farm_id,
                "name": f"Paddock {j}",
                "area_ha": random.randint(5, 20)
            })

    with open("pilot_data/farms.json", "w") as f:
        json.dump(farms, f, indent=2)
    with open("pilot_data/paddocks.json", "w") as f:
        json.dump(paddocks, f, indent=2)

    # 2. Weekly Metrics (9 months)
    start_date = datetime(2025, 1, 1)
    kpi_snapshots = []
    
    for week in range(36):
        current_date = start_date + timedelta(weeks=week)
        for farm in farms:
            # Simulate improvement over time
            improvement_factor = min(1.0, 0.5 + (week / 36) * 0.5)
            kpi_snapshots.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "farm_id": farm["id"],
                "grazing_efficiency": 0.6 + (0.2 * improvement_factor) + (random.random() * 0.1),
                "biomass_stability": 0.5 + (0.3 * improvement_factor) + (random.random() * 0.1),
                "soil_carbon_proxy": 1.2 + (week * 0.05 * improvement_factor),
                "overgrazing_events": max(0, 5 - int(week/6)) if random.random() > 0.7 else 0
            })

    with open("pilot_data/kpi_snapshots.csv", "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=kpi_snapshots[0].keys())
        writer.writeheader()
        writer.writerows(kpi_snapshots)

    # 3. Social Events
    social_events = []
    for week in range(36):
        current_date = start_date + timedelta(weeks=week)
        if week > 4: # Community adoption starts after week 4
            for _ in range(random.randint(2, 8)):
                farm = random.choice(farms)
                social_events.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "farm_id": farm["id"],
                    "event_type": random.choice(["observation_shared", "peer_validation", "goal_reached"]),
                    "impact_score": random.randint(1, 10)
                })

    with open("pilot_data/social_events.csv", "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["date", "farm_id", "event_type", "impact_score"])
        writer.writeheader()
        writer.writerows(social_events)

    print("Pilot data generated successfully.")

if __name__ == "__main__":
    generate_pilot_data()
