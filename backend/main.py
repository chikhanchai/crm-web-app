from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth
from routers import customers, users, interactions, opportunities, share_of_wallet

app = FastAPI(title="CRM System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(users.router)
app.include_router(interactions.router)
app.include_router(opportunities.router)
app.include_router(share_of_wallet.router)

@app.get("/")
def root():
    return {"message": "Welcome to CRM Web App API"}
