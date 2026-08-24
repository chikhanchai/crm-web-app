from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, customers, users

app = FastAPI(title="CRM System")

# Allow CORS for React frontend (default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Welcome to CRM Web App API"}
