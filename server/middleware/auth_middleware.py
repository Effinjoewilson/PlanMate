from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import verify_token
from db.models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({"error": "Token missing"}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token"}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return f(current_user=user, *args, **kwargs)
    return decorated
