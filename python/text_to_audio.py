from bark import SAMPLE_RATE, generate_audio, preload_models
from IPython.display import Audio


preload_models()

text_prompt = """
テストです

何かしらの文言を喋ってくれるはず
"""

audio_array = generate_audio(text_prompt)
Audio(audio_array, rate=SAMPLE_RATE)

