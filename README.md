
Add `.env` file in root path.

To start server:

`npm start`

--

Micro-service architecture.

Services:

-node.service-notification </br>
-node.service-reminder </br>
-node.service-user </br>

--
-node.service-user - CRUD users, posts, buckets and reminders </br>
-node.service-notification - to send emails through Amazon SES </br>
-node.service-reminder - to run cron job to find reminders and generate post for reminders </br>

--
Actual project is private and latest version is private
