from flask import Flask, jsonify # type: ignore

app = Flask(__name__)

@app.route('/exercise')
def exercise():
    exercises = []  # Initialize an empty list to store exercises
    try:
        with open("exercise.txt", "r") as file:
            for line in file:
                exercises.append(line.strip())  # Add each stripped line to the list
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404  # Handle file not found error

    print(exercises)
    
    return jsonify({"exercise": exercises})  # Convert dictionary to JSON


if __name__ == '__main__':
    app.run(debug=True)
