# maxflow
Sport match and player video analysis and analytics platform

##Current Features
- Offline video upload.
- Video renaming according to user input via form.
- Validation: Upload button enabled only when a name and video file has been selected.
- Video information extraction including file format/type, size and name.

##Features in Pipeline
- Compressing and encoding videos by reducing resolution to acceptable quality.
- In-browser Video player integration using Video.js

##Requirements

* Node.js v0.12.0: Download [here](https://nodejs.org/download/)
* Git
* Chrome (web browser)

##Instructions (Windows)

1. Install the above requirements. Confirm that Node.js was installed correctly by typing 'node --version' in Windows Command Prompt/Powershell. v0.12.0 should be displayed.
2. Clone this repo using 'git clone https://github.com/imobi/maxflow.git' in your chosen directory. e.g C:/Maxflow.
3. Open Powershell/Command Prompt on Windows
  - Set the current directory to the chosen directory in step 2. e.g cd "C:/Maxflow"
  - Run the command "node server.js". 
  - "Magic happens at port 3000" should be displayed. Your firewall may pop up with a notification - if so proceed to allow Node.js to use port 3000.
4. Open your web browser (preferably Chrome), and go to 'localhost:3000'. This should start the Maxflow web application! That's it.
5. Videos uploaded will automatically upload to: <your-chosen-directory-in-2>/Video Uploads

