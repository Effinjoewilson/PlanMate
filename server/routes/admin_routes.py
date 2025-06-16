from flask import Blueprint, request, jsonify, make_response
from db.models import Admin, User
from db import db
from utils.auth_utils import hash_password, verify_password
from utils.jwt_utils import generate_token, verify_token
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('admin_token')
        if not token:
            return jsonify({"error": "Token missing"}), 401

        admin_id = verify_token(token)
        if not admin_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        return f(current_admin=admin, *args, **kwargs)
    return decorated

@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not verify_password(admin.password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(admin.id)
    resp = make_response(jsonify({
        "message": f"Welcome Admin {admin.name}",
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email
        }
    }))
    resp.set_cookie(
        'admin_token', token, httponly=True, secure=False, samesite='Lax',
        max_age=24 * 60 * 60
    )
    return resp

@admin_bp.route('/admin/logout', methods=['POST'])
def admin_logout():
    resp = make_response(jsonify({"message": "Admin logged out"}))
    resp.set_cookie('admin_token', '', expires=0)
    return resp

@admin_bp.route('/admin/users', methods=['GET'])
@admin_token_required
def get_all_users(current_admin):
    users = User.query.all()
    user_data = [{
        "id": u.id,
        "name": u.name,
        "email": u.email
    } for u in users]
    return jsonify(user_data), 200
