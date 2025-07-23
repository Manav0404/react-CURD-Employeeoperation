from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# Connect to MySQL and database
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456"
)
cursor = connection.cursor()
cursor.execute("CREATE DATABASE IF NOT EXISTS company")
cursor.execute("USE company")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        department VARCHAR(100)
    )
""")

# ✅ GET all employees
@app.route('/api/employees', methods=['GET'])
def get_employees():
    cursor.execute("SELECT * FROM employees")
    rows = cursor.fetchall()
    employees = [{'id': r[0], 'name': r[1], 'age': r[2], 'department': r[3]} for r in rows]
    return jsonify(employees)

# ✅ POST - Add new employee
@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    dept = data.get('department')
    cursor.execute("INSERT INTO employees (name, age, department) VALUES (%s, %s, %s)", (name, age, dept))
    connection.commit()
    return jsonify({'message': 'Employee added successfully'}), 201

# ✅ DELETE - Delete employee by ID
@app.route('/api/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    cursor.execute("DELETE FROM employees WHERE id=%s", (id,))
    connection.commit()
    return jsonify({'message': 'Employee deleted successfully'})

# ✅ PUT - Update employee by ID  
@app.route('/api/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = request.get_json()
    name = data.get('name')
    age = data.get('age')
    dept = data.get('department')
    cursor.execute("UPDATE employees SET name=%s, age=%s, department=%s WHERE id=%s", (name, age, dept, id))
    connection.commit()
    return jsonify({'message': 'Employee updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)
