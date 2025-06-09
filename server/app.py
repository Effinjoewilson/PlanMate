from flask import Flask
from flask_cors import CORS
from config.settings import Config
from db import db

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    # Load configuration from settings
    app.config.from_object(Config)

    # Initialize database
    db.init_app(app)

    # Import and register routes blueprints
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")


    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
