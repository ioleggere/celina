from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_socketio import SocketIO, Namespace, emit

import json

import os
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Level(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    matrix = db.Column(db.Text, nullable=False)  

db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username_exists = User.query.filter_by(username=data['username']).first()
    email_exists = User.query.filter_by(email=data['email']).first()
    
    if username_exists:
        return jsonify({'message': 'Username already exists'}), 400
    if email_exists:
        return jsonify({'message': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(name=data['name'], username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.filter_by(id=current_user_id).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'logged_in_as': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@app.route('/add_level', methods=['POST'])
def add_level():
    data = request.json
    name = data['name']
    matrix = data['matrix']  # Assuming matrix is sent as a 2D list
    
    # Convert matrix to JSON string
    matrix_json = json.dumps(matrix)
    
    new_level = Level(name=name, matrix=matrix_json)
    db.session.add(new_level)
    db.session.commit()
    
    return jsonify({'message': 'Level added successfully'}), 201

@app.route('/get_level/<int:level_id>', methods=['GET'])
def get_level(level_id):
    level = Level.query.get(level_id)
    if not level:
        return jsonify({'message': 'Level not found'}), 404
    
    # Convert JSON string back to 2D list
    matrix = json.loads(level.matrix)
    
    return jsonify({
        'id': level.id,
        'name': level.name,
        'matrix': matrix
    }), 200

@app.route('/get_levels', methods=['GET'])
def get_levels():
    levels = Level.query.all()
    all_levels = []
    for level in levels:
        all_levels.append({
            'id': level.id,
            'name': level.name,
            'matrix': json.loads(level.matrix)
        })
    
    return jsonify(all_levels), 200

class RoomNamespace(Namespace):
    def on_connect(self):
        room = request.path.split('/')[-1]  # Extract the room name from the URL
        self.room = room
        print('Client connected to room:', room)

    def on_disconnect(self):
        print('Client disconnected from room:', self.room)
        # Emit a disconnect event to notify other clients in the room
        emit('disconnect', {'message': 'A user has disconnected'}, room=self.room)

    def on_custom_disconnect(self, data):
        print('Client disconnected from room:', self.room)
        if 'userId' in data and 'username' in data:
            user_id = data['userId']
            username = data['username']
            emit('custom_disconnect', {'userId': user_id, 'username': username}, room=self.room, include_self=False)

    def on_player_position(self, data):
        # Verifique se os dados contêm informações relevantes
        if 'userId' in data and 'username' in data and 'newX' in data and 'newY' in data and 'direction' in data:
            user_id = data['userId']
            username = data['username']
            new_x = data['newX']
            new_y = data['newY']
            direction = data['direction']
            print('Received player position from user', user_id, '(', username, '):', new_x, ',', new_y)
            # Envie os dados da posição para todos os outros clientes na mesma sala, exceto o remetente
            emit('update_player_position', {'userId': user_id, 'username': username, 'newX': new_x, 'newY': new_y, 'direction': direction}, room=self.room, include_self=False)

            
socketio.on_namespace(RoomNamespace('/lobby'))

#celroom

class CelNamespace(Namespace):
    def on_connect(self):
        room = request.path.split('/')[-1]  # Extract the room name from the URL
        self.room = room
        print('Client connected to room:', room)

    def on_disconnect(self):
        print('Client disconnected from room:', self.room)
        # Emit a disconnect event to notify other clients in the room
        emit('disconnect', {'message': 'A user has disconnected'}, room=self.room)

    def on_custom_disconnect(self, data):
        print('Client disconnected from room:', self.room)
        if 'userId' in data and 'username' in data:
            user_id = data['userId']
            username = data['username']
            emit('custom_disconnect', {'userId': user_id, 'username': username}, room=self.room, include_self=False)

    def on_player_position(self, data):
        # Verifique se os dados contêm informações relevantes
        if 'userId' in data and 'username' in data and 'newX' in data and 'newY' in data and 'direction' in data:
            user_id = data['userId']
            username = data['username']
            new_x = data['newX']
            new_y = data['newY']
            direction = data['direction']
            print('Received player position from user', user_id, '(', username, '):', new_x, ',', new_y)
            # Envie os dados da posição para todos os outros clientes na mesma sala, exceto o remetente
            emit('update_player_position', {'userId': user_id, 'username': username, 'newX': new_x, 'newY': new_y, 'direction': direction}, room=self.room, include_self=False)


socketio.on_namespace(CelNamespace('/celroom'))

class ChatNamespace(Namespace):
    def on_connect(self):
        room = request.path.split('/')[-1]  # Extract the room name from the URL
        self.room = room
        print(f'Client connected to chat room: {room}')

    def on_disconnect(self):
        print(f'Client disconnected from chat room: {self.room}')
        emit('disconnect', {'message': 'A user has disconnected'}, room=self.room)

    def on_message(self, data):
        if data:
            print(f'Received message: {data} in room: {self.room}')
            emit('message', data, room=self.room)

socketio.on_namespace(ChatNamespace('/chat'))

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
