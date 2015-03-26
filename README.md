# maxflow
Sport match and player video analysis and analytics platform

##Technical Overview
Maxflow is a sports match and player performance video analytics platform. It's a web application built on the MEAN stack. **Node.js** and the **Express** web framework is used on the backend while **AngularJS, HTML 5 and CSS** are used on the front-end. MongoDB will be used as the database. Maxflow can be used offline and online in the browser while a sync process will ensure the online server is updated.

The completed web application will consist of three main components:
 1. **Uploader** - Performs video upload (offline and online). Offline uploads will be stored in the Maxflow application folder (which will ultimately be in C:/Program Files when the completed product is distributed). When an internet connection is available uploaded videos will be syncrhonized with a cloud-based server.
 2. **Converter** - Converts original uploaded video using fluent-ffmpeg module. The goal here is to compress large video files (such as those from HD camcorders) to obtain a smaller file size while maintaining an acceptable viewing quality for later analysis in the Editor. 
 3. **Editor** - User can create custom categories and can assign or tag segments of the video with these categories. There will be at least two tables in the database:
  - **Categories** table with columns:
     - CategoryID (Primary Key)
     - Category name
     - Category description
  - **Tags** table with columns:
     - TagID (*Primary Key*)
     - start_time (timestamp of starting point in video of the play being tagged)
     - end_time (timestamp of ending point in video of the play being tagged)
     - CategoryID (*Foreign Key*)
     - video_name (name of video as stored in offline folder/cloud server)
     - tag_duration (difference between start_time and end_time)

##Completed Components
- Video Upload
  - Offline upload: file is copied to Maxflow application folder inside "Video Uploads" folder.
  - Video renaming according to user input via form.
  - Validation: Upload button enabled only when a name and video file has been selected.
  - Video information extraction including file format/type, size and name.
  - In-browser video player displays video for mp4, ogg and webm video files.
- Video Converter: Encoding and Compression
  - Extracts resolution, aspect ratio, frame rate, format and codec of original video.
  - Uses extracted information to calculate optimal settings* for encoding to achieve best compression and quality:
     - Original aspect ratio is maintained
     - Optimal format  chosen is mp4 using H.264 codec
     - Optimal resolution for 16:9 aspect ratio videos chosen: 640x480 (SD)
     - Optimal resolution for 4:3 aspect ratio videos chosen: 640x360 (SD)
     - Videos with width lower than 640 pixels maintain original resolution to avoid distortion.
     - Optimal frame rate is 30 fps or less. Videos with higher original frame rates are converted to 30 fps or half of original frame rate. e.g. 70 fps -> 35 fps.
  - **Note**: Optimal settings algorithm developed based on information from [Youtube's advanced encoding settings] (https://support.google.com/youtube/answer/1722171?hl=en) and [Vimeo's compression guidelines](https://vimeo.com/help/compression).

##Components in Development
- Database: 
  - Setting up of MongoDB and successfully writing and pulling data to it from Express/Angular(??). 
  - Creation of database tables, column definitions including data types and limits etc.
- Editor: Allow tagging and categorising of video segments. 
- Video player/browser: Integrating a feature-rich video player such as Video.js to enable advance video playing and timeline features in the browser.

##Features to be added later
- Sync process to synchronous videos on the user's machine with online, cloud-based server. This will allow the user to access videos from any location by logging in through the Maxflow web application on a web broswer.
- AI/Neural network: Automatic tagging and categorizing of various sport scenes and plays in a video.

##Requirements

* Node.js v0.12.0: Download [here](https://nodejs.org/download/)
* Chrome (web browser)

##Instructions (Windows)

1. Install the above requirements. Confirm that Node.js was installed correctly by typing the following in Windows Command prompt/Powershell:
  ````
  node --version
  ```` 

  **v0.12.0** should be displayed.
2. Clone this repo using 'git clone https://github.com/imobi/maxflow.git' in your chosen directory. e.g C:/Maxflow.
3. Open Powershell/Command Prompt on Windows
  - Set the current directory to the chosen directory in step 2. e.g cd "C:/Maxflow"
  - Run the command "node server.js". 
  - "Magic happens at port 3000" should be displayed. Your firewall may pop up with a notification - if so proceed to allow Node.js to use port 3000.
4. Open your web browser (preferably Chrome), and go to 'localhost:3000'. This should start the Maxflow web application! That's it.
5. Videos uploaded will automatically upload to: *your-chosen-directory-in-2*/public/Video Uploads

