import express, { json } from 'express'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import { SendEmailCommand, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";


const app = express()
const port = 3002
const jsonParser = bodyParser.json()
const osyncImageLink = "https://ci4.googleusercontent.com/proxy/jRLPJXwDZltCO2YIB3-iJFMlnA7dUuJ9lBFFA2wMPeIXTc6tAES5wj5aXaV_Iz6xp5hDZ4vaSi3IouwRlKFgnDEMzZ1mNR5R3WcBqdFb9rRYIdwHMay5VweUQFWvRc2sR9K6fIr137EYeOlyvweMrO1ayT2oJ2inP-5lfx6dn5p1SHuQZqUtf0FFGRYLCO1CE8n95_jWlvyZDieKAYtg3JBVNIFPyEwIsT6DVcNIwc1enK8=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FOsync.PNG?alt=media&token=516112f0-f280-4deb-90cb-daafd97b4769";
const osyncBannerLink = "https://ci6.googleusercontent.com/proxy/PaGRBS9BrECv4ZcVBcx74Zd7YqZxiAfh9fDB4SPFSIdXHS4zRPCWR_XFefM_8DRfzcwEtlGnsIp9jk87ZVTdLVyWmRYbdruyUQfbxQPU8Z95bNdsKkLCggardsmuVJvRT-EKdQtPujyheoFnr8TZRkYeMGvvWwlN3tmTHcYwBuIWjMV0O06904s13id9XZ-A4vyzlAXu9U0GV3LSJUQ7ZeLtsF80_2hrPqJvNb0LleyJtL0iVq1-P1O0=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FReportBanner.png?alt=media&token=f0fa0d58-657a-4edc-b6d4-e03f0d576af7"
const cycleTimeImageLink = "https://ci4.googleusercontent.com/proxy/6NT7s6ZDd12UaKgId5WHmpzzB04OpB_h8-Ruok9vdLcOQmaBKHQWeyYYsd9RjaQEEad3Ia1KVnUfdx8DkmdoWfGmlBbk75rKvqvO1Hys0AxXa-eh2FAsEcELa3q9oGtSx2ub5tncjuFL-62MkkmawZTOMF3wAQpl3AfsiNvmRWgaa7-QOyfV59HKdc_uxZAsaAPY5HZx7Rt_AwpSyJGTS4b8lnIFkBXHe6BmMkWgzomg7ebAhS-dhOxZznsA-se3BGr_0bw=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FTotal%20In-Cycle%20Time.png?alt=media&token=f96309a7-42e9-424f-9fd4-491ea2468f19"
const partsCounterImageLink = "https://ci5.googleusercontent.com/proxy/Xl5WGAcyhDnppJOyY-nq9mqOWcP4-3yRYBnH5fn18kMycCG0aX6BeS4pk_lA7imndEhL1lWRwQqNY1X8i40XCvq6xU6S7WWdQJb-4uFxswj2otACU6qGWQuu5arpBnlViVuHgW8yzyPZFmYzLs3tJ73iDUKiEH6oUMQum0tVGMCBbMKa2dRLRuTn5yxH0PUgqunl1TKvN3oAYf-Z5y0cuEVo0ga9KT8idGpwuB0zmgUQ0RfJqzcfqsNjwQ=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FCycle%20Count.png?alt=media&token=921e4a38-32eb-4206-ad90-5b2e3f065262"
const averageCycleTimeImageLink = "https://ci3.googleusercontent.com/proxy/992GYYVowXoLugSf1JmXsyUgzz9w7PtOCXsNcHTwbUSVhlSe2EDgfsGgabPAwf-tN1IHw7X8qWJlqRCHb3zar_W5nZVQm38g6EE2oL-y1Xwv-Gp4hnOOXBbAUFWPgr3K5CfQwcIncBHHXTlhiHDmvMeyqaui76RR8khqKt6tPo8at1ZegHjBQxPXNZdf_IV3e7LelfHmX_x3xkB8Hi1O2wjajadk0d3HqAFMAfmapQS--xkDkTfV0zGwAiTikbO7hqSdgw=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FAverage%20Cycle%20Time.png?alt=media&token=7b12d020-40cc-4f49-ba5f-da790d229c85"
const productivityImageLink = "https://ci4.googleusercontent.com/proxy/QE3kivJWUewpIOBnrIlk40NsDW4kHoMACD27TuXW_wDFeq4RUrZbKxpC_ez3J-W4zQRzCRMwTtv3D4H8oqx2e7H5stQWWtqmvM1orDjwVkHKEGbq5B5KbOqQirJ_cUNmOgmUQYtcV-ip1hTsTsIZdwx_0oaT0Ot0TCZCGjzomFmSKwzjPZ8inkN_DsCBS5k6ODtkvU-ySB7S-_pfA8Pf2Y_G-4AxvhNaFn56-heUhxTsFpWTb-vzlxTu=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FProductivity.png?alt=media&token=1d908097-6ca7-498e-be86-bb33c1c6b300"
const machineOnTimeImageLink = "https://ci6.googleusercontent.com/proxy/f8CpHTxQ_8Yv5WuHxP0z6bU_O95NNFcyfRPJejbw5250AhqqBe95NDlgewZChaB2-Kl5rLYIexpSAXskwZZbjmusVnsQ7sEEyDx5Ra5MgvXd0roGtB5_qkvrMYv0mfNXEGhBZptacFCgOx6nKkRCkPouMV9tLmr3hviNDH_cEUoBv9VFdgbrw1tUOqIdoNKVTVT2zycaOAuuHMHxasmyTjVpw-fbHNtAK8He4Uv29FNK6AxTRiqDO0TJXRoFxes=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FMachine%20On-Time.png?alt=media&token=7b7dcff0-71cb-4ca6-bfd9-1b95d263877e"
const loadTimeImageLink = "https://ci4.googleusercontent.com/proxy/KN1TFZzWn6mTrFZavncHHfJPVgtraXjxahkbFd5yk_ysjIV8-bOG64oIMFetsZM7MHWLGdkvswI8BMoeMUuQrquSWkqnWBJJn4VRIcRSjN2aOBxspcGlXJsP2vkHfpcc4YCOcs-bs0xze-JpotLFaiE9CM7dCqq9CsTcZDGYqi0jtVrqv60hbJVxfLOUGSINb0wkkHnFOpN6oUjFHMWnjgAnMvh5wiR50pldvOQF_uy0VHBd7LJwmlvARziRT4XN8z5dqCx_SyCl9ZOYcYuD=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FAverage%20Time%20Between%20Cycles.png?alt=media&token=3248105b-5a4c-475c-becf-add24cf3f144"




const createSendEmailCommand = (to, from, bodyInfo) => {
    let dateIdentiferTable = generateWeekdaysTable();
    let bodyTables = generateBodyTables(bodyInfo);
    let date = (new Date()).toLocaleDateString();
    let emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    *{
        font-family: Lato;
    }

    td{
        display: inline-block;
    }

    p{
        font-size: 16px;
    }

      .header-image{
        max-width: 40%;
        min-width: 500px;
        display: block;
        padding: 10px;
        margin: 0 auto;
        height: auto;
      }

      .date-container{
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        margin: 0 auto;
      }
      
      .day-table-container{
        width: 40%;
        min-width: 620px;
        margin: auto;
        padding: 10px;
      }
      .every-day{
        width: 80px;
        height: 80px;
        border-radius: 50%;
        font-size: 30px;
        color: #fff;
        line-height: 80px;
        text-align: center;
        font-family: 'Lato';
        background: #a2abab;
      }
      .current-day{
        font-weight: bold;
        background: #32a740;
      }
      .day-table-row{
        width: 100%;
        min-height: 70px;
      }

      .table-container{
        margin: 0 auto;
      }

      .data-table{
        text-align: center;
        margin: 0 auto;
        border-spacing: 0;
        border-collapse: collapse;
      }

      .td-element{
        width: 260px;
        height: 290px;
        border-width: 0px;
        border-style: groove;
        border-color: #4f4c4d;
      }

      .td-img-container{
        text-align: center;
      }

      .td-img{
        max-height: 90px;
      }

      .td-h3{
        font-size: 20px;
      }

      .data-text{
        font-size: 22px;
      }

  </style>
</head>
<body>
      <div class="header-image-container">
        <img src="${osyncImageLink}" alt="Osync Logo" class="header-image">
        <img src="${osyncBannerLink}" alt="Osync Banner" class="header-image">
      </div>
      <div class="date-container">
        Date: <span style="color:green">${date}</span>
      </div>
        ${dateIdentiferTable}
        <hr>
        ${bodyTables}      

</body>
</html>
`

    return new SendEmailCommand({
        Destination: {
            ToAddresses: [to]
        },
        Source: from,
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailBody,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "This is the text format body",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: `Osync Daily Report | Date: ${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            }
        }
    })


    function generateWeekdaysTable() {
        const daysOfWeek = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
        const currentDate = new Date();
        const currentDay = currentDate.getDay();

        const tableRow = daysOfWeek.map((day, index) => {
            if (index === currentDay) {
                return `<th align="center"><div class="current-day every-day"><span class="day-text">${day}</span></div></th>`;
            } else {
                return `<th align="center"><div class="every-day"><span class="day-text">${day}</span></div></th>`;
            }
        }).join('');

        const table = `
          <table class="day-table-container">
            <tr class="day-table-row">${tableRow}</tr>
          </table>
        `;

        return table;
    }


    function generateBodyTables(bodyInfo) {
        let emailBody = ``;
        for (let i = 0; i < bodyInfo.length; i++) {
            let bucket = bodyInfo[i].bucket;
            let productivity = bodyInfo[i].productivity;
            let totalOnTime = bodyInfo[i].totalOnTime;
            let totalCycleTime = bodyInfo[i].totalCycleTime;
            let averageCycleTime = bodyInfo[i].averageCycleTime;
            let partsProduced = bodyInfo[i].partsProduced;

            emailBody += `
              <div class="table-container">
                <div style="margin:0 auto; text-align:center; font-size:1.2rem;">
                    <h2 style="color:green">${bucket}</h2>
                </div>
                <table class="data-table">
                    <tr>
                      <td class="td-element">
                        <div style="margin:0 20px">
                            <div class="td-image-container">
                                <img src="${cycleTimeImageLink}" class="td-img"/>
                            </div>
                            <h3 class="td-h3">Total Cycle Time</h3>
                            <div class="data-text">
                                ${totalCycleTime}
                            </div>
                        </div>
                        <div>
                            <p>Amount of time spent in an automatic mode with a running status</p>
                        </div>
                      </td>
                      <td class="td-element">
                      <div style="margin:0 20px">
                          <div class="td-image-container">
                              <img src="${averageCycleTimeImageLink}" class="td-img"/>
                          </div>
                          <h3 class="td-h3">Average Cycle Time</h3>
                          <div class="data-text">
                              ${averageCycleTime}
                          </div>
                      </div>
                      <div>
                          <p>Average amount of time taken to complete an automatic cycle</p>
                      </div>
                    </td>
                    <td class="td-element">
                    <div style="margin:0 20px">
                        <div class="td-image-container">
                            <img src="${machineOnTimeImageLink}" class="td-img"/>
                        </div>
                        <h3 class="td-h3">Machine ON Time</h3>
                        <div class="data-text">
                            ${totalOnTime}
                        </div>
                    </div>
                    <div>
                        <p>Total amount of time the machine was powered on</p>
                    </div>
                  </td>
                  <td class="td-element">
                  <div style="margin:0 20px">
                      <div class="td-image-container">
                          <img src="${productivityImageLink}" class="td-img"/>
                      </div>
                      <h3 class="td-h3">Productivity</h3>
                      <div class="data-text">
                          ${productivity}
                      </div>
                  </div>
                  <div>
                      <p>Amount of time in Automatic or MDI cycles</p>
                  </div>
                </td>
                <td class="td-element">
                <div style="margin:0 20px">
                    <div class="td-image-container">
                        <img src="${partsCounterImageLink}" class="td-img"/>
                    </div>
                    <h3 class="td-h3">Parts Produced</h3>
                    <div class="data-text">
                        ${partsProduced}
                    </div>
                </div>
                <div>
                    <p>The number of times the parts counter was incremented during the day</p>
                </div>
              </td>
                    </tr>
                <table>
              </div>    
            <hr>
            `


   
        }

        return emailBody;
    }


}

const run = async (to, from, emailData) => {
    const SendEmailCommand = createSendEmailCommand(to, from, emailData);
    try {
        console.log(emailData)
        return await sesClient.send(SendEmailCommand);
    } catch (err) {
        console.error(err, err.stack);
    }
}

app.post('/send-email', jsonParser, (req, res) => {

    const to = req.body.email
    const from = "tstott@cronsrud.com"
    const buckets = req.body.buckets
    const org = req.body.org
    const token = req.body.token
    let emailData = [];

    const postData = {
        org: org,
        token: token,
        buckets: buckets
    }

    async function postRequest() {
        const data = await fetch('http://localhost:3001/email-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        const responseData = await data.json()
        emailData = responseData

        run(to, from, emailData)


        res.send("Emails should probably have sent...idk man")
    }

    postRequest();

})

app.listen(port, () => {
    console.log("We do be listnin'")
})