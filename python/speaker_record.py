import soundcard as sc
import soundfile as sf
import pprint

fs = 48000
recording_sec = 3

default_mic = sc.get_microphone(id=sc.default_speaker().name, include_loopback=True)

with default_mic.recorder(samplerate=fs) as mic:
    for i in range(10):
        print("Recording...")
        data = mic.record(numframes=fs*recording_sec)
        print(data)
        print("Saving...\n")
        sf.write(f'./pc_out_{i:02}.wav', data, fs)


