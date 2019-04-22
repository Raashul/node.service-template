
Add `.env` file in root path.

To start server:

`npm start`

--

App to digitize your book/article highlights and send reminders(weekly, daily, specific)

--

Micro-service architecture.

Services:

-node.service-notification </br>
-node.service-reminder </br>
-node.service-user </br>

</br>
-node.service-user - CRUD users, posts, buckets and reminders. Image is stored in Amazon S3 bucket </br>
-node.service-notification - to send emails through Amazon SES </br>
-node.service-reminder - to run cron job to find reminders and generate post for reminders </br>

-
Actual project is private and latest version is private

Beta releasing soon!

-

<img src ='./images/login.png' width="50%" height="30%" />

<img src ='./images/home.png' width="50%" height="30%" />

<img src ='./images/addIcon.png' width="50%" height="30%" />

<img src ='./images/createBucket.png' width="50%" height="30%" />

<img src ='./images/posts.png' width="50%" height="30%" />

<img src ='./images/readMore.png' width="50%" height="30%" />

<img src ='./images/reminders.png' width="50%" height="30%" />
<img src ='./images/settings.png' width="50%" height="30%" />

