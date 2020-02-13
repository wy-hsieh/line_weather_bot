require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已開啟')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    console.log(111)
    rp('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-1DB81876-EF17-4AB0-B058-D530A57F7855&format=JSON')
      .then(htmlString => {
        let json = JSON.parse(htmlString)
        json = json.records.location.filter(j => {
          if (j.locationName === usermsg) return true
          else return false
        })
        console.log(json[0].weatherElement[2].time[0].parameter.parameterName)
        const MinT = json[0].weatherElement[2].time[1].parameter.parameterName
        const MaxT = json[0].weatherElement[4].time[1].parameter.parameterName
        if (json.length > 0) event.reply(`今日最低溫:${MinT}℃\n      最高溫:${MaxT}℃`)
        else event.reply('沒有資料')
      })
      .catch(() => {
        event.reply('發生錯誤')
      })
  }
})
