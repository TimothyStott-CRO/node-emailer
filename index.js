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
const machineNameImageLink = "https://ci5.googleusercontent.com/proxy/Xl5WGAcyhDnppJOyY-nq9mqOWcP4-3yRYBnH5fn18kMycCG0aX6BeS4pk_lA7imndEhL1lWRwQqNY1X8i40XCvq6xU6S7WWdQJb-4uFxswj2otACU6qGWQuu5arpBnlViVuHgW8yzyPZFmYzLs3tJ73iDUKiEH6oUMQum0tVGMCBbMKa2dRLRuTn5yxH0PUgqunl1TKvN3oAYf-Z5y0cuEVo0ga9KT8idGpwuB0zmgUQ0RfJqzcfqsNjwQ=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FCycle%20Count.png?alt=media&token=921e4a38-32eb-4206-ad90-5b2e3f065262"
const averageCycleTimeImageLink = "https://ci3.googleusercontent.com/proxy/992GYYVowXoLugSf1JmXsyUgzz9w7PtOCXsNcHTwbUSVhlSe2EDgfsGgabPAwf-tN1IHw7X8qWJlqRCHb3zar_W5nZVQm38g6EE2oL-y1Xwv-Gp4hnOOXBbAUFWPgr3K5CfQwcIncBHHXTlhiHDmvMeyqaui76RR8khqKt6tPo8at1ZegHjBQxPXNZdf_IV3e7LelfHmX_x3xkB8Hi1O2wjajadk0d3HqAFMAfmapQS--xkDkTfV0zGwAiTikbO7hqSdgw=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FAverage%20Cycle%20Time.png?alt=media&token=7b12d020-40cc-4f49-ba5f-da790d229c85"
const productivityImageLink = "https://ci4.googleusercontent.com/proxy/QE3kivJWUewpIOBnrIlk40NsDW4kHoMACD27TuXW_wDFeq4RUrZbKxpC_ez3J-W4zQRzCRMwTtv3D4H8oqx2e7H5stQWWtqmvM1orDjwVkHKEGbq5B5KbOqQirJ_cUNmOgmUQYtcV-ip1hTsTsIZdwx_0oaT0Ot0TCZCGjzomFmSKwzjPZ8inkN_DsCBS5k6ODtkvU-ySB7S-_pfA8Pf2Y_G-4AxvhNaFn56-heUhxTsFpWTb-vzlxTu=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FProductivity.png?alt=media&token=1d908097-6ca7-498e-be86-bb33c1c6b300"
const machineOnTimeImageLink = "https://ci6.googleusercontent.com/proxy/f8CpHTxQ_8Yv5WuHxP0z6bU_O95NNFcyfRPJejbw5250AhqqBe95NDlgewZChaB2-Kl5rLYIexpSAXskwZZbjmusVnsQ7sEEyDx5Ra5MgvXd0roGtB5_qkvrMYv0mfNXEGhBZptacFCgOx6nKkRCkPouMV9tLmr3hviNDH_cEUoBv9VFdgbrw1tUOqIdoNKVTVT2zycaOAuuHMHxasmyTjVpw-fbHNtAK8He4Uv29FNK6AxTRiqDO0TJXRoFxes=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FMachine%20On-Time.png?alt=media&token=7b7dcff0-71cb-4ca6-bfd9-1b95d263877e"
const loadTimeImageLink = "https://ci4.googleusercontent.com/proxy/KN1TFZzWn6mTrFZavncHHfJPVgtraXjxahkbFd5yk_ysjIV8-bOG64oIMFetsZM7MHWLGdkvswI8BMoeMUuQrquSWkqnWBJJn4VRIcRSjN2aOBxspcGlXJsP2vkHfpcc4YCOcs-bs0xze-JpotLFaiE9CM7dCqq9CsTcZDGYqi0jtVrqv60hbJVxfLOUGSINb0wkkHnFOpN6oUjFHMWnjgAnMvh5wiR50pldvOQF_uy0VHBd7LJwmlvARziRT4XN8z5dqCx_SyCl9ZOYcYuD=s0-d-e1-ft#https://firebasestorage.googleapis.com/v0/b/osync-188119.appspot.com/o/HTML_Templates%2FImages%2FAverage%20Time%20Between%20Cycles.png?alt=media&token=3248105b-5a4c-475c-becf-add24cf3f144"




const createSendEmailCommand = (to, from, bodyInfo) => {
    console.log(bodyInfo)
    let bucket = bodyInfo.bucket
    let dateIdentiferTable = generateWeekdaysTable();
    let dataRow = generateTableData(bodyInfo);

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    *{
        font-family: Lato;
    }
    table {
        font-family: Helvetica, Arial, sans-serif;
        width: 100%;
        border-collapse: collapse;
    }
    td {
        padding: 10px;
        text-align: center;
      }
      img {
        max-width: 50%;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .every-day{
        background-color: rgb(162, 171, 171);
        border-radius: 50%;
        width: 75px;
        height: 75px;
        font-weight: bold;
        color: white;
        font-family: Lato;
        padding: 10px;
      }
      .current-day{
        background-color: green;
        font-weight: bold;
      }
      .day-table-container{
        width: 50%;
        margin: 0 auto;
      }
      .day-table-row{
        width: 100%;
      }
      .day-text{
        font-weight: bold;
        font-size: 25px;
        display: inline-block;
        width: 100%;
        height: 100%;
        margin-top: 25%;
      }
      .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .date-row{
        font-size: 25px;
        font-weight: bold;
      }
      .data-header-text{
        font-size: 25px;
        font-weight: bold;
        color: black;
      }
      .data-text{
        font-size: 25px;
      }
  </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="5" class="header-image-container">
                <img src="${osyncImageLink}" alt="Osync Logo" class="headerImage">
            </td>
        </tr>
        
        <tr>
            <td colspan="5" class="banner-image-container">
                <img src="${osyncBannerLink}" alt="Osync Banner" class="bannerImage">
            </td>
        </tr>
        <tr>
            <td colspan="5" class="day-identifier-table">
                <table>
                    <tr>
                        ${dateIdentiferTable}
                    </tr>
                </table>
            </td>
            </tr>
            <tr>
                <td colspan="5" >
                    <span class="date-row">S/N: <span style="color:green;">${bucket}</span> Date:<span style="color:green;">${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}</span></span>
                </td>
        </tr>
        <tr>
        <td>
            <img src="${productivityImageLink}" class="smallImg" alt="Image 2">
        </td>
        <td>
            <img src="${machineOnTimeImageLink}" class="smallImg" alt="Image 3">
        </td>
        <td>
            <img src="${cycleTimeImageLink}" class="smallImg" alt="Image 4">
        </td>
        <td>
            <img src="${averageCycleTimeImageLink}" class="smallImg" alt="Image 5">
        </td>
        </tr>
        <tr class="bold headerRow">
            <td class="data-header-text">Productivity</td>
            <td class="data-header-text">Total On Time</td>
            <td class="data-header-text">Total Cycle Time</td>
            <td class="data-header-text">Average Cycle Time</td>
        </tr>
            ${dataRow}
        </table>
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
                Data: `Osync Daily Report for S/N: ${bucket} | Date: ${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            }
        }
    })


    function generateWeekdaysTable() {
        const daysOfWeek = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
        const currentDate = new Date();
        const currentDay = currentDate.getDay();

        const tableRow = daysOfWeek.map((day, index) => {
            if (index === currentDay) {
                return `<td><div class="current-day every-day flex-container"><span class="day-text">${day}</span></div></td>`;
            } else {
                return `<td><div class="every-day flex-container"><span class="day-text">${day}</span></div></td>`;
            }
        }).join('');

        const table = `
          <table class="day-table-container">
            <tr class="day-table-row">${tableRow}</tr>
          </table>
        `;

        return table;
    }

    function generateTableData(bodyInfo) {
        let productivity = bodyInfo.productivity;
        let totalOnTime = bodyInfo.totalOnTime;
        let totalCycleTime = bodyInfo.totalCycleTime;
        let averageCycleTime = bodyInfo.averageCycleTime;
        let productivityColor = '';

        if (productivity >= 0 && productivity < 60) {
            productivityColor = 'red';
        } else if (productivity >= 60 && productivity < 80) {
            productivityColor = 'yellow';
        } else if (productivity >= 80 && productivity <= 100) {
            productivityColor = 'green';
        }

        return `
            <tr>
                <td class="data-text" style="color: ${productivityColor};">${productivity}%</td>
                <td class="data-text">${totalOnTime}</td>
                <td class="data-text">${totalCycleTime}</td>
                <td class="data-text">${averageCycleTime}</td>
            </tr>
        `;
    }



}

const run = async (to, from, emailData) => {
    const SendEmailCommand = createSendEmailCommand(to, from, emailData);
    try {
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
        for (let i = 0; i < emailData.length; i++) {
            run(to, from, emailData[i])
        }
        res.send("Emails should probably have sent...idk man")
    }
    postRequest();

})

app.listen(port, () => {
    console.log("We do be listnin'")
})