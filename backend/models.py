from sqlalchemy import Table, Column, Integer, String, Float, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from database import engine

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"
    __table_args__ = {'autoload_with': engine}
    
    interactions = relationship("Interaction", back_populates="user")
    opportunities = relationship("Opportunity", back_populates="user")

class Customer(Base):
    __table__ = Table('Customers', Base.metadata, Column('id', Integer, primary_key=True), autoload_with=engine)
    
    interactions = relationship("Interaction", back_populates="customer")
    opportunities = relationship("Opportunity", back_populates="customer")
    share_of_wallet = relationship("ShareOfWallet", back_populates="customer")

class Interaction(Base):
    __tablename__ = "Interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("Customers.id"))
    user_id = Column(Integer, ForeignKey("Users.id"))
    interaction_date = Column(DateTime)
    interaction_type = Column(String(50))
    notes = Column(Text)
    next_action = Column(String(255))
    next_action_date = Column(Date)
    
    customer = relationship("Customer", back_populates="interactions")
    user = relationship("User", back_populates="interactions")

class Opportunity(Base):
    __tablename__ = "Opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("Customers.id"))
    user_id = Column(Integer, ForeignKey("Users.id"))
    deal_name = Column(String(255))
    product_category = Column(String(100))
    est_deal_value_thb = Column(Float)
    stage = Column(String(50))
    confidence_percent = Column(Integer)
    expected_close_date = Column(Date)
    
    customer = relationship("Customer", back_populates="opportunities")
    user = relationship("User", back_populates="opportunities")

class ShareOfWallet(Base):
    __tablename__ = "ShareOfWallet"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("Customers.id"))
    product_category = Column(String(100))
    current_vendor = Column(String(255))
    quantity = Column(String(100))
    current_price_thb = Column(Float)
    contract_expiry_date = Column(Date)
    notes = Column(Text)
    
    customer = relationship("Customer", back_populates="share_of_wallet")
