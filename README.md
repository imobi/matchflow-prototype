# maxflow
Sport match and player video analysis and analytics platform

##Technical Overview
Maxflow is a sports match and player performance video analytics platform. It's a web application built on the MEAN stack. **Node.js** and the **Express** web framework is used on the backend while **AngularJS, HTML 5 and CSS** are used on the front-end. MongoDB will be used as the database. Maxflow can be used offline and online in the browser while a sync process will ensure the online server is updated.

The completed web application will consist of three main components:
 1. **Uploader** - Performs video upload (offline and online). Offline uploads will be stored in the Maxflow application folder (which will ultimately be in C:/Program Files when the completed product is distributed). When an internet connection is available uploaded videos will be syncrhonized with a cloud-based server.
 2. **Converter** - Converts original uploaded video using fluent-ffmpeg module. The goal here is to compress large video files (such as those from HD camcorders) to obtain a smaller file size while maintaining an acceptable viewing quality for later analysis in the Editor. 
 3. **Editor** - User can create custom events and can tag segments of the video with these events. There will be at least two tables in the database: Events and Tags. Events are defined by the user in the Editor, for example an event called "Penalty Team Blue" might be created with a lead time of 10sec and lag time of 20 sec. When a time point (say 00:05:02) in the video is tagged with this event, the tag stored will define start time (lead time) as 10 seconds before (00:05:52) and end time (lag time) as 20 seconds after (00:05:22). Collections (tables) in the database will use the following schemas:
  - **Events** table with columns:
     - event_id
     - Event Name
     - Lead time
     - Lag time
  - **Tags** table with columns:
     - tag_id
     - start_time (timestamp of starting point in video of the play being tagged)
     - end_time (timestamp of ending point in video of the play being tagged)
     - event_id (*Foreign Key*)
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
- Video Editor: Project creation and Event adding
     - Once the user has uploaded and converted a video, the Editor will come up on screen.
     - Here, the user is asked to enter a project name. The project name is used to create a new database table to store events and tags. This is done on the backend. MongoDB is used.
     - Then, the user is asked to add Events: event name, lead time and lag time are required. Events are added to the table. User can add unlimited number of events.

##Components in Development
- Editor: Allow tagging of time poings in the video with the events that were defined by the user.
- Video player/browser: Integrating a feature-rich video player such as Video.js to enable advance video playing and timeline features in the browser.

##Features to be added later
- Progress bar: For video uploader and converter.
- Sync process to synchronous videos on the user's machine with online, cloud-based server. This will allow the user to access videos from any location by logging in through the Maxflow web application on a web broswer.
- AI/Neural network: Automatic tagging and categorizing of various sport scenes and plays in a video.

##Requirements

* Node.js v0.12.0: Download [here](https://nodejs.org/download/)
* MongoDB v3.0: Download [here] (https://www.mongodb.org/downloads) and follow [these instructions](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows) to install.
* Chrome (web browser)

##Instructions (Windows)

1. Install the above requirements. Confirm that Node.js was installed correctly by typing the following in Windows Command prompt/Powershell:
  ````
  node --version
  ```` 

  **v0.12.0** should be displayed.
2. Clone this repo using 'git clone https://github.com/imobi/maxflow.git' in your chosen directory. e.g C:/Maxflow.
3. Run MongoDB server, from Command Prompt on Windows, navigate to the directory where you installed MongoDB which contains the mongod.exe file.
  - Now, specify the data directory using the command:
     ````
     .\mongod.exe --dbpath "C:/Maxflow"
     ````
     This should get the MongoDB server up and listening to the default port. Do not close this command prompt window.
4. Open a **second** Powershell/Command Prompt on Windows
  - Set the current directory to the chosen directory in step 2 (i.e. our Git repo). e.g cd "C:/Maxflow"
  - Run the command "node server.js". 
  - "Magic happens at port 3000" should be displayed. Your firewall may pop up with a notification - if so proceed to allow Node.js to use port 3000.
  - "Connection successful to MongoDB" should also be displayed indicated that the Mongo server has been connected to.
5. Open your web browser (preferably Chrome), and go to 'localhost:3000'. This should start the Maxflow web application! That's it.
6. Videos uploaded will automatically upload to: *your-chosen-directory-in-2*/public/Video Uploads

