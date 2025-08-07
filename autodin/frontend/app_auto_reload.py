import os
import sys
import time
import subprocess
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets/img', 'favicon.ico')

@app.route('/<path:path>')
def catch_all(path):
    return index()

class ReloadHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = 0
        
    def on_modified(self, event):
        if event.src_path.endswith('.html') or event.src_path.endswith('.py'):
            current_time = time.time()
            if current_time - self.last_modified > 1:  # Debounce
                self.last_modified = current_time
                print(f"\n>>> Modification détectée: {event.src_path}")
                print(">>> Redémarrage automatique dans 1 seconde...")
                time.sleep(1)
                os._exit(0)  # Force restart

def run_with_watcher():
    # Démarrer le watcher
    event_handler = ReloadHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=True)
    observer.start()
    
    print("\n" + "="*50)
    print("AUTODIN - AUTO-RELOAD ACTIVÉ")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Le serveur redémarre automatiquement")
    print("après chaque modification!")
    print("="*50 + "\n")
    
    try:
        app.run(host='0.0.0.0', port=8090, debug=False, use_reloader=False)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == '__main__':
    run_with_watcher()