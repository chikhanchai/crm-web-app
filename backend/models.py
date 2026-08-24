from sqlalchemy import MetaData, Table, Column, Integer
from sqlalchemy.orm import declarative_base
from database import engine

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"
    __table_args__ = {'autoload_with': engine}

class Customer(Base):
    __table__ = Table('Customers', Base.metadata, Column('id', Integer, primary_key=True), autoload_with=engine)
