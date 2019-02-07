'use strict';

const moment = require('moment');

const response = require(__base + '/app/modules/common/response');
const addModule = require(__base + '/app/modules/reminder/add');
const infoModule = require(__base + '/app/modules/reminder/info');

const postGeneration = require(__base + '/app/modules/secondary_service/postGeneration');


module.exports.getAllReminders = async (req, res) => {
  try {
    const user_id = req.authInfo.user_id;
    let response_body = {
      user_id
    }

    const reminders = await infoModule.getAllRemindersForUser(req.request_id, response_body);
    response_body.reminders = reminders;
    response.success(req.request_id, response_body, res);

  } catch(e) {
    response.failure(req.request_id, e, res);

  }
}


module.exports.addSpecificReminder = async (req, res) => {
  try {
    let user_id = req.authInfo.user_id;
    let body = req.body;
    let reminder_body = {};
    
    // const { number_of_posts, time, bucket_id, type, sub_type, days } = body;
    const { number_of_posts, time, bucket_id, type, days, bucket_name } = body;
    // const { time, bucket_id, type, days } = body;

    let new_body = { number_of_posts, days, time, bucket_id, type, bucket_name }
    new_body.user_id = user_id;

    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('hh:mm a');
    //check for any missing values
    await addModule.init(req.request_id, new_body);
    await addModule.checkIfDaysAreaValid(req.request_id, days);

    //convert days(string) into number.
    const days_to_integer = convertDaysToNumber(days);

    for(let i =0; i < days_to_integer.length; i++){
      let selected_day_as_num = days_to_integer[i];
      // new_body.day = day;
      new_body.day = days[i]; 
      let result = addDaysAndTime(currentDate, selected_day_as_num, moment().day(), new_body.type);
      let date  = moment(result.date).format('YYYY-MM-DD');
      new_body.reminder_date = date;
      new_body.reminder_time = time;

      await addModule.specificReminderInit(req.request_id, new_body);
      // await addModule.specificReminderValidation(req.request_id, new_body);
    
      const config_id = await addModule.insertIntoConfigTable(req.request_id, new_body);
      const post = await generatePosts(req.request_id, new_body);
      reminder_body = {
        config_id: config_id,
        email: post.email,
        post_id: post.post_id,
        bucket_id: post.random_bucket_id_selected,
        reminder_date: new_body.reminder_date,
        reminder_time: new_body.reminder_time,
        user_id: new_body.user_id,
      }

      
      //insert first reminder into reminder table
      const reminder_id = await addModule.insertIntoRemindersTable(req.request_id, reminder_body);
    }
    response.success(req.request_id, {bucket_id}, res);


  } catch(e) {
    response.failure(req.request_id, e, res);
  }

}

function convertDaysToNumber(days) {
  const converted_days = [];
  days.forEach(day => {
    switch(day) {
      case "Sunday":
        converted_days.push(0);
        break;
      case "Monday":
        converted_days.push(1);
        break;
      case "Tuesday":
        converted_days.push(2);
        break;
      case "Wednesday":
        converted_days.push(3);
        break;
      case "Thursday":
        converted_days.push(4);
        break;
      case "Friday":
        converted_days.push(5);
        break;
      case "Saturday":
        converted_days.push(6);
        break;
      default: 
        break;
    }
  })
  return converted_days;
}

function addDaysAndTime(currentDate, reminderDay, currentDay, type) {
  let res = {};
  let desiredDate = currentDate;
  switch(type) {
    case "daily":
      // let startOfWeek = moment(currentDate, "YYYY-MM-DD").add(1, 'months').startOf('isoWeek');
      // while (startOfWeek.day() !== reminderDay) {
      //   startOfWeek.add(1, 'day');
      // } 
    break;

    case "monthly":
      desiredDate = moment(currentDate, "YYYY-MM-DD").add(1, 'months').startOf('month');
      while (desiredDate.day() !== reminderDay) {
        desiredDate = moment(desiredDate, "YYYY-MM-DD").add(1, 'days');
      } 
      break;

    case "weekly":
      while(currentDay != reminderDay) {
        if(currentDay == 7) {
          currentDay = 0;
        } else {
          desiredDate = moment(desiredDate, "YYYY-MM-DD").add(1, 'days');
          currentDay++;  
        }
      }
      break;

      default: 
        res.err = 'Invalid type';
      break;
  }

  //add time
  // desiredDate= moment(desiredDate).add(hours, 'hours');
  res.date = desiredDate;
  return res;
}


//check if more buckets exists
//randomly pick one bucket
//inside the bucket, randomly pick a post
//get post information
// with user_id, get the email information of the user
// store all information in reminders table
const generatePosts =  async (request_id, data) => {

  let new_body = data;
  const bucket_id = await postGeneration.pickRandomBucket(request_id, new_body);
  new_body.random_bucket_id_selected = bucket_id;
  
  const post = await postGeneration.pickRandomPost(request_id, new_body);
  new_body.post_id = post.post_id;
  // new_body.post_content = post.content;

  const email = await postGeneration.getUserInformation(request_id, new_body);
  new_body.email = email; 

  return new_body;

}