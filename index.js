const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const ChatBot = require('dingtalk-robot-sender')
const fs = require('fs')

const maxIDFile = 'max_notice_id'

const robot = new ChatBot({
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=4774d5ea0c7ab34a7d3baaf93372fd9dad31401161403acfbae9936cf8ea04cc'
});


process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error);
  process.exit(1) // To exit with a 'failure' code
});

const sleep = async function(time) {
  return new Promise((resolve) => setTimeout(resolve, time*1000));
};
function randomNum(minNum,maxNum){ 
  switch(arguments.length){ 
      case 1: 
          return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      break; 
          default: 
              return 0; 
          break; 
  } 
};

const ding = async function(txt) {
  await robot.text("coin:\n" + txt);
};

const parseID = async function(url) {
  let idx = url.lastIndexOf("=")
  return url.substring(idx+1)
};

const loadMaxID = async function() {
  let data = fs.readFileSync(maxIDFile)
  return parseInt(data, 10)
};

const getNotice = async function() {
  let browser = await puppeteer.launch({
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
  })
  try {
    let page = await browser.newPage()
    await page.goto('https://www.ibox.art/zh-cn/notice/')
    await page.waitForSelector('.notice-wrapper')
    let content = await page.content()
    let $ = cheerio.load(content)
    let noticeDiv = $(".notice-wrapper")
    let maxID = await loadMaxID()
    let newMaxID = 0
    for (let i = 0; i < noticeDiv.length; i++) {
      noticeURL = noticeDiv[i].attribs.href
      let id = parseInt(await parseID(noticeURL), 10)
      if (id > maxID) {
        if (id > newMaxID) {
          newMaxID = id
        }
        let url = 'https://www.ibox.art/' + noticeURL
        let title = $(noticeDiv[i]).find(".text")[0].children[0].data.trim()
        let time = $(noticeDiv[i]).find(".time")[0].children[0].data.trim()
        console.log(url, title, time)
        await ding(url + '\n' + title + '\n' + time )
      }
      if (newMaxID > maxID) {
        fs.writeFileSync(maxIDFile, newMaxID+'')
      }
    }
  } finally {
    await browser.close()
  }
};

(async () => {
  while(true) {

    await getNotice()
    let sec = randomNum(10, 60)
    console.log("next work in: " + sec)
    await sleep(sec)
  }
})()