from flask import Blueprint, request, jsonify
from middleware.auth_middleware import token_required
from db.models import User, Activity
from db import db
from datetime import datetime

user_bp = Blueprint('user', __name__)

@user_bp.route('/me', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }), 200

@user_bp.route('/activities', methods=['POST'])
@token_required
def add_activity(current_user):
    data = request.json
    date_str = data.get("date")
    text = data.get("text")
    status = data.get("status", "Not started")  # default if not provided

    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    new_activity = Activity(user_id=current_user.id, date=date, text=text, status=status)
    db.session.add(new_activity)
    db.session.commit()

    return jsonify({"message": "Activity saved"}), 201


@user_bp.route('/activities', methods=['GET'])
@token_required
def get_activities(current_user):
    date_str = request.args.get("date")
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    activities = Activity.query.filter_by(user_id=current_user.id, date=date).all()
    result = [{"id": a.id, "text": a.text, "status": a.status} for a in activities]


    return jsonify(result), 200

@user_bp.route('/activities/<int:activity_id>', methods=['PUT'])
@token_required
def update_activity_status(current_user, activity_id):
    data = request.json
    new_status = data.get("status")

    activity = Activity.query.get(activity_id)
    if not activity or activity.user_id != current_user.id:
        return jsonify({"error": "Activity not found"}), 404

    activity.status = new_status
    db.session.commit()
    return jsonify({"message": "Status updated"}), 200

@user_bp.route('/activities/<int:activity_id>', methods=['DELETE'])
@token_required
def delete_activity(current_user, activity_id):
    activity = Activity.query.get(activity_id)
    if not activity or activity.user_id != current_user.id:
        return jsonify({"error": "Activity not found"}), 404

    db.session.delete(activity)
    db.session.commit()
    return jsonify({"message": "Activity deleted"}), 200

