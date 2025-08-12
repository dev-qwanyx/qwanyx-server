from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='static', static_url_path='')

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN REACT APP")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Serving React build from: static/")
    print("="*50 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=8090,
        debug=True,
        use_reloader=True,
        threaded=True
    )