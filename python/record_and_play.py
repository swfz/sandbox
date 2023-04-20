import soundcard as sc
import whisper
import numpy
import soundfile as sf

outfilename='out2.wav'
model = whisper.load_model("base")

speaker = sc.default_speaker()
mic = sc.default_microphone()

samplerate = 48000 # サンプリング周波数(Hz)
sec = 5 # 時間(秒)

print('Record Start.....')
data = mic.record(samplerate=samplerate, numframes=samplerate*sec)
print(type(data))
print(data)
print('Record Stop.....')
sf.write(file=outfilename, data=data[:,0], samplerate=samplerate)

result = model.transcribe(outfilename)
print(result)


