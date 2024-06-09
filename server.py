from flask import Flask

app = Flask(__name__)



# Members API Route

@app.route('/members')
def members():
    list = []
    with open("exercise.txt", "r") as file:
        for line in file:
            list.append(print(line.strip()))
            # strip() removes the newline character at the end of each line

    return list


if __name__ == '__main__':
    app.run(debug=True)