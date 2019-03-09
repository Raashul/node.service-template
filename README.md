
Add `.env` file in root path.

To start server:

`npm start`

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
Actual project is private and latest version is private. Demo Images below:
-


<img src ='./images/home.png' width="60%" height="30%" />

<img src ='./images/bucket.png' width="60%" height="30%" />

<img src ='./images/post.png' width="60%" height="30%" />

<img src ='./images/readMore.png' width="60%" height="40%" />


