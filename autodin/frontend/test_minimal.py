from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>Test Autodin</h1><p>Si vous voyez ceci, Flask fonctionne!</p>'

if __name__ == '__main__':
    print("Test minimal - http://localhost:8090")
    app.run(port=8090, debug=False)