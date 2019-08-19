const axios = require('axios')
const stravaApiUrl = 'https://www.strava.com/api/v3/activities'
const StravaApiV3 = require('strava-v3')

const activityTypes = [{
  name: 'Ride',
  minDistance: 2000,
  maxDistance: 25000,
  avgSpeed: 21000
}, {
  name: 'Swim',
  minDistance: 800,
  maxDistance: 3000,
  avgSpeed: 2000
}, {
  name: 'run',
  minDistance: 2000,
  maxDistance: 8000,
  avgSpeed: 15000
}
]
// api.createActivity(name, type, startDateLocal, elapsedTime, opts, callback)
const activityAdjectives = ['Cool', 'Fun', 'Challenging', 'Enjoyable', 'Exiting', 'Relaxing']

const getRandomActivity = (date) => {
  const activity = {}
  const adjIndex = Math.floor(Math.random() * activityAdjectives.length)
  const activityTypeIndex = Math.floor(Math.random() * activityTypes.length)
  const activityType = activityTypes[activityTypeIndex]

  activity.type = activityType.name
  activity.name = `${activityAdjectives[adjIndex]} ${activity.type}`

  activity.distance = activityType.minDistance + Math.floor(Math.random() *
    (activityType.maxDistance - activityType.minDistance) * 10) / 10

  const speedVarianceRange = Math.floor(activityType.avgSpeed * 0.12)
  const speedVariance = Math.floor(Math.random() * speedVarianceRange)
  const addToSpeed = Math.random() > .50 ? true : false
  speed = addToSpeed ? activityType.avgSpeed + speedVariance : activityType.avgSpeed - speedVariance


  activity.elapsed_time = Math.floor(activity.distance / speed * 60 * 60)
  activity.description = 'Some activity description here' // {String} Description of the activity.
  activity.start_date_local = date.toISOString()
  console.log(activity)
  return activity
}

const generateActivities = () => {
  const activities = []
  let date = new Date()
  for (let i = 0; i < 100; i++) {
    activities.push(getRandomActivity(date))
    //  'trainer': 56, // {Integer} Set to 1 to mark as a trainer activity.
    // 'photoIds': photoIds_example, // {String} List of native photo ids to attach to the activity.
    //'commute': 56 // {Integer} Set to 1 to mark as commute.
    
    date.setDate(date.getDate() - 1)    
  }
  return activities
}


const uploadActivity = (activityArray) => {
  const opts = {
    headers: {
      ContentType: 'application/json',
      Authorization: 'Bearer 1294335c6b8d3f6e02316d8f7a05f36ee3fc7b76'
    }
  }
  activityArray.forEach(
    async activity => {
      try {
        console.log("Sending activity", activity)
        const response = await axios.post(stravaApiUrl, activity, opts)
        console.log(response)
      }
      catch (e) {
        // console.log(e.response.message)
      }
    }
  )
}
console.log("Generating and uploading...")

uploadActivity(generateActivities())
console.log("Done!")

// api.createActivity(name, type, startDateLocal, elapsedTime, opts, callback)

// module.exports = () => {
//   let activities = getActivityList('Ride')
//   activities = activities.concat(getActivityList('Run'))
//   activities = activities.concat(getActivityList('Swim'))
//   return { "strava-activities": activities }
// }
// const getActivityList = (activityType) => {
//   let activities = []
//   let date = new Date()
//   for (let i = 0; i < 30; i++) {
//     activities.push({
//       "name" : "Happy Friday",
//       "distance" : Math.floor(Math.random() * 30000 * 10) / 10,
//       "moving_time" : Math.floor(Math.random() * 2 * 60 * 60 * 10) / 10,
//       "elapsed_time" : Math.floor(Math.random() * 2 * 60 * 60 * 10) / 10,
//       "type" : activityType,
//       "workout_type" : 2,
//       "id" : 154504250376823,
//       "start_date_local" : date.toISOString(),
//       "average_speed" : Math.floor(Math.random() * 17 * 10) / 10,
//       "max_speed" : Math.floor(Math.random() * 30 * 10) / 10,
//       "kilojoules" : Math.floor(Math.random() * 1200 * 10) / 10,
//       "description" : "Some run",
//       "calories" : Math.floor(Math.random() * 10000 * 10) / 10,
//     })
//     date.setDate(date.getDate() - 1)
//   }
//   return activities
// }