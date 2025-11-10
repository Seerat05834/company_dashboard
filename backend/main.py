
import os
import csv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


CSV_PATH = r"C:\Users\PC\OneDrive\Desktop\New folder\Leads 2025 - Leads 2025.csv"
companies = []

if os.path.exists(CSV_PATH):
    with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        companies = [row for row in reader]
    print(f" Loaded {len(companies)} companies from CSV.")
else:
    print(f" CSV file not found: {CSV_PATH}")


@app.get("/search")
def search_companies(q: str = ""):
    """
    Example: /search?q=apple
    """
    if not companies:
        raise HTTPException(status_code=500, detail="CSV data not loaded.")
    if not q.strip():
        return {"count": 0, "results": []}

    query = q.lower()
    matched = [
        row for row in companies
        if query in row.get("Company Name", "").lower()
    ]

    return {"count": len(matched), "results": matched[:50]}  # limit to 50 results



@app.get("/company/{name}")
def get_company(name: str):
    if not companies:
        raise HTTPException(status_code=500, detail="CSV data not loaded.")
    for row in companies:
        if row.get("Company Name", "").lower() == name.lower():
            return row
    raise HTTPException(status_code=404, detail="Company not found")


