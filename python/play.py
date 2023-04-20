import soundcard as sc
import soundfile as sf
import sys

samplerate = 48000
read_wave_path = sys.argv[1]
print(read_wave_path)

default_speaker = sc.default_speaker()

with default_speaker.player(samplerate=samplerate) as sp:
    print(f"Reading...({read_wave_path})")
    data, fs = sf.read(read_wave_path)
    print("Playing...\n")
    sp.play(data)
