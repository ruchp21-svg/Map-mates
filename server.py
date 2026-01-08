#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

PORT = 3000
DIRECTORY = "build"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        # For SPA routing, serve index.html for non-static routes
        if not self.path.startswith('/static/') and not self.path.startswith('/.'):
            if '.' not in self.path.split('/')[-1]:  # No file extension
                self.path = '/index.html'
        return super().do_GET()
    
    def end_headers(self):
        # Disable caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        return super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"\n✅ Server running at http://localhost:{PORT}\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n❌ Server stopped\n")
