import soundcard as sc
import soundfile as sf
from pprint import pprint

samplerate = 48000
recording_sec = 5

default_mic = sc.default_microphone()

with default_mic.recorder(samplerate=samplerate) as mic:
    print("Recording...")
    data = mic.record(numframes=samplerate*recording_sec)
    print("Saving...\n")
    pprint(data)
    sf.write(f'./outfile.wav', data, samplerate)
