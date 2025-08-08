from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>Test Server OK!</h1>'

if __name__ == '__main__':
    print("Starting test server on http://127.0.0.1:5555")
    app.run(host='127.0.0.1', port=5555, debug=False)