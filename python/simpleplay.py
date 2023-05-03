import soundcard as sc
import numpy

speaker = sc.default_speaker()
mic = sc.default_microphone()

samplerate = 48000 # サンプリング周波数(Hz)
sec = 3 # 時間(秒)

data = mic.record(samplerate=samplerate, numframes=samplerate*sec)
speaker.play(data/numpy.max(numpy.abs(data)), samplerate=samplerate)
