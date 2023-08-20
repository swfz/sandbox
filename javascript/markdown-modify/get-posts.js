// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
import { WebClient, LogLevel } from '@slack/web-api'
import dayjs from 'dayjs';

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL_ID;
const targetDate = process.argv[2] || dayjs().format('YYYY-MM-DD');

const client = new WebClient(token, {
  // LogLevel can be imported and used to make debugging simpler
  // logLevel: LogLevel.DEBUG
});

const transformer = (message) => {
  const {text, ts} = message;
  const time = dayjs.unix(ts).format('HH:mm');

  return `${time} ${text}`;
}


(async() => {
  const result = await client.conversations.history({
    channel: channelId
  });

  const conversationHistory = result.messages;

  const groupByDate = conversationHistory.reduce((acc, message) => {
    const date = dayjs.unix(message.ts).format('YYYY-MM-DD');

    acc[date] = acc[date] || [];

    return {...acc, [date]: [...acc[date], message]};
  }, {});

  const list = groupByDate[targetDate].map(transformer).reverse();
  console.log(list);
})();