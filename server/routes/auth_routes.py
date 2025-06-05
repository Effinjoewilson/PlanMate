from flask import Blueprint, request, jsonify
from db.models import User
from db import db
from utils.auth_utils import hash_password
from utils.auth_utils import verify_password
from utils.jwt_utils import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Email not registered"}), 404

    if not verify_password(user.password, password):
        return jsonify({"error": "Invalid password"}), 401

    token = generate_token(user.id)

    return jsonify({
        "message": f"Welcome back, {user.name}!",
        "token": token
    }), 200

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed = hash_password(password)
    user = User(name=name, email=email, password=hashed)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 201
