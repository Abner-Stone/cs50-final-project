# YOUR PROJECT TITLE
#### Video Demo:  <https://youtu.be/1t6Z_eXrlbQ>
#### Description:
My final project uses the use of WebGL and Python and Flask to deliver a web app demonstrating the capabilities of WebGL, while also including a full leaderboard system, sign-in/sign-out system, and login interface. Coupled with a verification email to "verify," their account.

My first approach was to use OpenGL with C/C++ but decided against it since I felt it went over my head and the fact that I've always wanted to create a website. I found a tutorial on WebGL, which I copied to create my first 3d rotating cube. Then after I seperated the copied code and I went off the information and memory of the code to recreate the cube.

My design choice for the css library was tailwind css. This choice was purely influenced by the fact I saw a video on it recently. I used sqlite3 for my database since I found it easier since it was in the course. For my static folder I seperate my css, javascript, and favicon files to keep the filesystem more neat. In the root of my project, I have app.py and verify_email.py, which control the main logic of my website.

verify_email.py is what controls the logic to send emails to the recipiant to, "verify," their account. I also have a .env file to store the password of my sender gmail.

For the favicons, I used a resource: [favicon.io](favicon.io) to generate the favicon files which I dropped in my project.

All of the HTML files are self explanatory in their purpose. I also use that convention in my app.py to keep it as simple as possible.

For example:
`@app.route("/", methods="GET", "POST"):
  def index():
  #CODE GOES HERE
`

I also have a counter.js file that saves the seconds "stared," at the cube in the home page, using an ajax request to send it to my app.py, which then updates it in the database. It also uses jQuery to send the ajax request.

My database is stored in the root folder of my project which goes under the name `users.db`. Also another side note is I mostly expanded my WebGL code and seperated many of the files apart, such as put the different shaders like the vertex shader and fragment shaders in seperate files.

For the tailwind css I followed the starter guide in the tailwind css documentation. After following that, I have an input.css file that contains the pre requisites and then I have a dist folder that contains my outputted css from tailwind. Using tailwind in my html was very streamlined after installing a vs-code extension to make it easier to implement.

When I was doing the flask app problem sets in the course, I noticed the automatic refresh after changes were made. When I started developing this project, I had trouble trying to set that up. Turning to the discord community, I made a run.py file that automatically refreshes which made testing much more faster.

For my signup implementation, I was going to try and use google's sign-up api, but I found it way too annoying to work with. Some of the problems I ran into was the fact that I couldn't figure out how to send the google data from my javascript to my app.py file. Which is why I eventually decided to swap to manually implementing it.

I will say, before I ever began trying to implement OpenGL or WebGL, I wanted to make a web based app that tracked events using ticketmaster's api, but I eventually found it not in my interest, which hindered my ability to work on the project. Which is why I finally landed on this final project idea.

The hardest part about this project I would say is finding time to work on it. I mostly worked on it while I was in school, which proved difficult as you can only get so much stuff done in a small amount of time. But eventually I finished my final project!