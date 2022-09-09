const router = require('express').Router();
const {google, Common} = require("googleapis")

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:3000")



router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post("/create-tokens", async (req, res, next) => {
    try {
      const {code} = req.body
      console.log(code)
     const tokens = await oauth2Client.getToken(code);
      res.send({tokens})
    }catch(error) {
      next(error)
    }
})

router.post("/create-event", async (req, res, next) => {
    try {
    const { summary,
    description,
    location,
    startDate,
    endDate,attendees,
    conferenceData,
    reminders
} = req.body;
oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
const calendar = google.calendar("v3")

const response = await calendar.events.insert({
  auth: oauth2Client,
  calendarId: "primary",
  requestBody: {
    summary, description,location, colorId: "6", start: {
      dateTime: new Date(startDate),
    },
    end: {
      dateTime: new Date(endDate)
    },
    attendees,
    conferenceData,
    reminders
  },
  conferenceDataVersion: 1
})
res.send(response)
    }catch(error) {
      next(error);
    }
})


router.get("/calendar-event", async (req, res, nex) => {
  oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

  const calendar = google.calendar("v3")
 const data = await calendar.events.list({
    auth: oauth2Client,
    calendarId: "primary",
    timeMin: "2022-09-03T00:00:00.000Z",
    timeMax: "2022-09-04T00:00:00.000Z",
    timeZone: "Asia/Ho_Chi_Minh"
  })
  
 res.send({calendar:data.data});
})

router.get("/calendar-meet", async(req, res, next) => {
  oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

  google.auth = oauth2Client;

  const rp = google.admin("reports_v1");
  rp.activities.list({
    auth: oauth2Client,
    applicationName: "meet",
    eventName: "num_calls",
    maxResults: 10,
    userKey: "tam253199@gmail.com"
  }).then((dataUT) => {
    res.send({calendar:dataUT.data});
  }).catch((error)=> {
    res.send({error})
  })
  // endTime: "2022-09-04T00:00:00.000Z",
  // key: "dba-tjvq-fis"

  // const authClient = await auth.getClient(); 
 

  // const bigQuery = google.bigquery("v2")

  // const data = await bigQuery.datasets.list({
  //   auth: oauth2Client,
  //   maxResults: 10,
  //   projectId: "ringed-codex-360401",
  
  // })   

  // res.send({data})

 
  // const data = await calendar.events.list({
  //   auth: oauth2Client,
  //   calendarId: "primary",
  //   timeMin: "2022-09-03T00:00:00.000Z",
  //   timeMax: "2022-09-04T00:00:00.000Z",
  //   timeZone: "Asia/Ho_Chi_Minh"
  // })

  // const item = await calendar.events.get({
  //   auth: oauth2Client,
  //   calendarId: "primary",
  //   eventId: "51q5dcnnm5omo8toiffsfpkgn4",
  //   timeZone: "Asia/Ho_Chi_Minh"
  // })

  // const blogger = google.blogger({
  //   version: 'v3',
   
  //   params: {
  //     blogId: '3213900'
  //   }
  // });


})

module.exports = router;
