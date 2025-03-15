from fugashi import Tagger

# Initialize the Fugashi tagger (which uses MeCab)
tagger = Tagger()

# Example Japanese text
text = "私は日本語を勉強しています。"

# Tokenize and analyze the text
for word in tagger.parse(text).splitlines():
    if word:
        print(word)
