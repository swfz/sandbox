import numpy as np
import soundcard as sc
import threading
import queue
import soundfile as sf
from pprint import pprint

# 録音の設定
samplerate = 48000  # サンプルレート
threshold = 0.1  # 無音のしきい値
silence_duration = 3  # 無音の継続時間 (秒)

# 無音判定のためのサンプル数
silence_samples = int(samplerate * silence_duration)

# 録音データ取得
microphone = sc.default_microphone()

def record_audio(queue):
    with microphone.recorder(samplerate=samplerate) as mic:
        while True:
            data = mic.record(numframes=silence_samples)
            queue.put(data)
            if stop_recording.is_set():
                break

# ストリームを処理するスレッド
stop_recording = threading.Event()
q = queue.Queue()
record_thread = threading.Thread(target=record_audio, args=(q,))
record_thread.start()

# 録音データをリアルタイムで処理
segments = []
current_data = np.array([], dtype=np.float32)
silent_frames = 0
outfilename="segments.wav"

try:
    while True:
        new_data = q.get()
        flatten = np.frombuffer(new_data, dtype=np.float32)

        current_data = np.concatenate((current_data, flatten))

        for sample in current_data:
            if np.abs(sample) < threshold:
                silent_frames += 1
            else:
                silent_frames = 0

            if silent_frames >= silence_samples:
                splitted = current_data[:-silent_frames]

                segments.append(splitted)
                print(f"Segment {len(segments)} detected")  # ここで区切られたセグメントを表示

                file_data = np.reshape(splitted, [-1,1])
                sf.write(file=f"./wavs/{len(segments)}-{outfilename}", data=file_data, samplerate=samplerate)

                # リセット
                current_data = np.array([], dtype=np.float32)
                silent_frames = 0

except KeyboardInterrupt:
    stop_recording.set()
    record_thread.join()

    # 最後の部分を追加
    if len(current_data) > 0:
        segments.append(current_data)

# 結果を表示
for i, segment in enumerate(segments):
    print(f"Segment {i + 1}: {segment}")
