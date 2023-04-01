# YOUR PROJECT TITLE
#### Video Demo:  <URL HERE>
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

I also have a counter.js file that saves the seconds "stared," at the cube in the home page, using an ajax request to send it to my app.py, which then updates it in the database.