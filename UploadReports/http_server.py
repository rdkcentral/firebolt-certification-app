import http.server
import socketserver
import os
import time
from urllib.parse import urlparse, parse_qs, unquote
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import shutil

import convertjsontoexcel

# Set the directory you want to serve files from
directory = "/root/FCA/reports/"

# Define the function to call when a new JSON file is added
def process_json_file(file_path):
        print("New JSON file added:", file_path)
        #Converting the json file to an excel file and save in reports directory
        time.sleep(20)
        excel_file=file_path.replace(".json",".xlsx")
        print("Converting JSON to excel",file_path)
        convertjsontoexcel.convert_json_to_excel(file_path,excel_file)
        #moving the json file to a backup folder for reference
        json_file_name = os.path.basename(file_path)
        new_json_path=directory+"json_reports/"+json_file_name
        shutil.move(file_path, new_json_path)

# Define a custom event handler to handle file system events
class MyFileSystemEventHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith('.json'):
            print("Created Event")
            process_json_file(event.src_path)

# Set up the filesystem event handler
event_handler = MyFileSystemEventHandler()
os.makedirs(os.path.join(directory, "json_reports"), exist_ok=True)
observer = Observer()
observer.schedule(event_handler, directory, recursive=False)
observer.start()

class MyHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
       parsed_url = urlparse(self.path)
       path = unquote(parsed_url.path)
       print (path)
       if path == '/':
           # List the contents of the directory
           files = os.listdir(directory)
           file_list = "<ul>"
           self.send_response(200)
           self.send_header('Content-type', 'text/html')
           self.end_headers()
           for file in files:
              # if ".html" in file:
                   file_url = f"{parsed_url.path}reports/{file}"  # Preserve the folder name in the URL
                   file_list += f"<li><a href='{file_url}'>{file}</a></li>"
           file_list += "</ul>"
           response = f"<html><body><h1>FCA Reports</h1>{file_list}</body></html>"
           self.wfile.write(response.encode())
       elif ".json" in path or ".xlsx" in path:
           print (os.path.basename(self.path))
           report_name=directory+os.path.basename(self.path)
           with open(report_name, 'rb') as file:

               self.send_response(200)
               self.send_header('Content-type', 'application/octet-stream')
               self.send_header("Content-Disposition", f'attachment; filename="{os.path.basename(self.path)}"')
               self.end_headers()
               self.wfile.write(file.read())
       else:
           # Serve files using the built-in SimpleHTTPRequestHandler
           super().do_GET()

    def do_POST(self):
        # Parse the URL and retrieve the file name from the query string
        parsed_url = urlparse(self.path)
        ##query_string = parse_qs(parsed_url.query)
        query_string = parsed_url.path
        if 'refAppExecReport' in query_string:
            ##filename = query_string['filename'][0]
            filename = query_string
#            filepath = os.path.join(directory, filename)
            filepath = "/root/FCA/reports/"+filename

          # Read the data from the POST request and save it to the file
            content_length = int(self.headers['Content-Length'])
            print (content_length)
            post_data = self.rfile.read(content_length)

            with open(filepath, 'wb') as file:
                file.write(post_data)

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(f"<html><body><h1>File {filename} uploaded successfully.</h1></body></html>".encode())
        else:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'Bad Request: Missing "filename" parameter.')

# Create an HTTP server on port 8080
with socketserver.TCPServer(("localhost", 8000), MyHandler) as httpd:
    print("Server started on port 8000")
    httpd.serve_forever()
