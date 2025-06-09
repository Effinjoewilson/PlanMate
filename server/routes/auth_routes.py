from flask import Blueprint, request, jsonify, make_response
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

    if not user or not verify_password(user.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user.id)
    resp = make_response(jsonify({
        "message": f"Welcome back, {user.name}!",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }))

    # Set cookie with HttpOnly flag
    resp.set_cookie(
        'token', token, httponly=True, secure=False, samesite='Lax',
        max_age=24 * 60 * 60  # 1 day
    )
    return resp

@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({"message": "Logged out"}))
    resp.set_cookie('token', '', expires=0)
    return resp

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
