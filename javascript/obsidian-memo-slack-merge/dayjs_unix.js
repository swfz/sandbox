import dayjs from 'dayjs';


const ts = '1688893846.297589';
const time = dayjs.unix(ts);

const timeStr = time.format('YYYY-MM-DD HH:mm:ss');

console.log(timeStr);
// 2023-07-09 18:10:46