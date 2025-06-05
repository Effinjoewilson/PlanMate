import os
from dotenv import load_dotenv

# Load .env file from the server directory
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

class Config:
    SECRET_KEY = os.getenv("JWT_SECRET")
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
