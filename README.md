--

App to digitize our book/article highlights and send reminders(weekly, daily, specific)

--

Micro-service architecture.

Services:

-node.service-notification </br>
-node.service-reminder </br>
-node.service-user </br>
-node.service-refer </br>

</br>
-node.service-user - CRUD users, posts, buckets and reminders. Image is stored in Amazon S3 bucket </br>
-node.service-notification - to send emails through Amazon SES </br>
-node.service-reminder - to run cron job to find reminders and generate post for reminders </br>
-node.service-reminder - to send refers for 1st release </br>

-
Actual project is private and latest version is private

Releasing soon!

-

<img src ='./images/login.png' width="50%" height="30%" />

<img src ='./images/home.png' width="50%" height="30%" />

<img src ='./images/addIcon.png' width="50%" height="30%" />

<img src ='./images/createBucket.png' width="50%" height="30%" />

<img src ='./images/posts.png' width="50%" height="30%" />

<img src ='./images/readMore.png' width="50%" height="30%" />

<img src ='./images/reminders.png' width="50%" height="30%" />
<img src ='./images/settings.png' width="50%" height="30%" />

