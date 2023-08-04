import TinySegmenter from "https://esm.sh/tiny-segmenter@0.2.0";

const title = "Slack APIで特定チャンネルの会話履歴を取得する";

const segmenter = new TinySegmenter();
const segments = segmenter.segment(title);

console.log(segments);
