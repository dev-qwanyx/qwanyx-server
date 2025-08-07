from flask import Flask, render_template
from jinja2 import Environment, FileSystemLoader
import os

# Tester si le template a des erreurs
def test_template():
    print("Test du template index.html...")
    
    try:
        env = Environment(loader=FileSystemLoader('templates'))
        template = env.get_template('index.html')
        
        # Essayer de rendre le template
        html = template.render()
        print(f"✓ Template chargé avec succès ({len(html)} caractères)")
        
        # Vérifier les erreurs courantes
        if '{{' in html or '}}' in html:
            print("⚠ ATTENTION: Il reste des {{ }} non traités dans le template!")
            
        if '{%' in html and '%}' in html:
            print("✓ Blocs Jinja2 détectés")
            
        return True
        
    except Exception as e:
        print(f"✗ ERREUR dans le template: {str(e)}")
        print(f"  Type: {type(e).__name__}")
        return False

if __name__ == '__main__':
    test_template()