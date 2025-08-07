from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://tebello:cis2368DB!@cis2368db.cnbc2hyq8axw.us-east-1.rds.amazonaws.com/CIS2368_DB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Floor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.String(20), nullable=False)
    floor_num = db.Column(db.Integer, db.ForeignKey('floor.id'), nullable=False)

class Resident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    room = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)

# ------------------ FLOOR ROUTES ------------------
@app.route('/api/floors', methods=['GET'])
def get_floors():
    floors = Floor.query.all()
    result = []
    for floor in floors:
        result.append({
            'id': floor.id,
            'level': floor.level,
            'name': floor.name
        })
    return jsonify(result)

@app.route('/api/floors', methods=['POST'])
def add_floor():
    data = request.get_json()
    new_floor = Floor(level=data['level'], name=data['name'])
    db.session.add(new_floor)
    db.session.commit()
    return jsonify({"message": "Floor added successfully!"})

@app.route('/api/floors/<int:id>', methods=['PUT'])
def update_floor(id):
    floor = Floor.query.get_or_404(id)
    data = request.get_json()
    floor.level = data['level']
    floor.name = data['name']
    db.session.commit()
    return jsonify({"message": "Floor updated successfully!"})

@app.route('/api/floors/<int:id>', methods=['DELETE'])
def delete_floor(id):
    floor = Floor.query.get_or_404(id)

    # Delete all rooms assigned to this floor first
    Room.query.filter_by(floor_num=id).delete()

    # Now delete the floor
    db.session.delete(floor)
    db.session.commit()
    return jsonify({"message": "Floor and its rooms deleted successfully!"})

# ------------------ ROOM ROUTES ------------------
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    result = []
    for room in rooms:
        result.append({
            'id': room.id,
            'number': room.number,
            'capacity': room.capacity,
            'floor_num': room.floor_num
        })
    return jsonify(result)

@app.route('/api/rooms', methods=['POST'])
def add_room():
    data = request.get_json()
    new_room = Room(number=data['number'], capacity=data['capacity'], floor_num=data['floor_num'])
    db.session.add(new_room)
    db.session.commit()
    return jsonify({"message": "Room added successfully!"})

@app.route('/api/rooms/<int:id>', methods=['PUT'])
def update_room(id):
    room = Room.query.get_or_404(id)
    data = request.get_json()
    room.number = data['number']
    room.capacity = data['capacity']
    room.floor_num = data['floor_num']
    db.session.commit()
    return jsonify({"message": "Room updated successfully!"})

@app.route('/api/rooms/<int:id>', methods=['DELETE'])
def delete_room(id):
    room = Room.query.get_or_404(id)

    # Delete all residents assigned to this room first
    Resident.query.filter_by(room=id).delete()

    # Now delete the room
    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Room and its residents deleted successfully!"})

# ------------------ RESIDENT ROUTES ------------------
@app.route('/api/residents', methods=['GET'])
def get_residents():
    residents = Resident.query.all()
    result = []
    for res in residents:
        result.append({
            'id': res.id,
            'firstname': res.firstname,
            'lastname': res.lastname,
            'age': res.age,
            'room': res.room
        })
    return jsonify(result)

@app.route('/api/residents', methods=['POST'])
def add_resident():
    data = request.get_json()
    new_resident = Resident(
        firstname=data['firstname'],
        lastname=data['lastname'],
        age=data['age'],
        room=data['room']
    )
    db.session.add(new_resident)
    db.session.commit()
    return jsonify({"message": "Resident added successfully!"})

@app.route('/api/residents/<int:id>', methods=['PUT'])
def update_resident(id):
    resident = Resident.query.get_or_404(id)
    data = request.get_json()
    resident.firstname = data['firstname']
    resident.lastname = data['lastname']
    resident.age = data['age']
    resident.room = data['room']
    db.session.commit()
    return jsonify({"message": "Resident updated successfully!"})

@app.route('/api/residents/<int:id>', methods=['DELETE'])
def delete_resident(id):
    resident = Resident.query.get_or_404(id)
    db.session.delete(resident)
    db.session.commit()
    return jsonify({"message": "Resident deleted successfully!"})

# ------------------ MAIN ------------------
if __name__ == '__main__':
    app.run(debug=True)
