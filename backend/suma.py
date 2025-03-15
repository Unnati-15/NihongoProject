from sudachipy import tokenizer
from sudachipy import dictionary
from collections import Counter

# Initialize Sudachipy tokenizer
tokenizer_obj = dictionary.Dictionary().create()

# Example Japanese text
text = """
私は日本語を勉強しています。日本語は非常に面白い言語です。日本の文化についてもっと学びたいです。
日本語を話すことで、日本の文化や習慣をより深く理解できます。また、日本に住んでいる日本人の友達と
会話をすることで、言語の使い方を自然に学べます。日本語を使うことが楽しいです。
"""
print(text)
# Tokenize the text
mode = tokenizer.Tokenizer.SplitMode.C
tokens = tokenizer_obj.tokenize(text, mode)

# Extract nouns, verbs, and adjectives (filtering based on part of speech)
nouns = [token.surface() for token in tokens if token.part_of_speech()[0] == '名詞']
verbs = [token.surface() for token in tokens if token.part_of_speech()[0] == '動詞']
adjectives = [token.surface() for token in tokens if token.part_of_speech()[0] == '形容詞']

# Count frequency of each noun, verb, and adjective
noun_counts = Counter(nouns)
verb_counts = Counter(verbs)
adj_counts = Counter(adjectives)

# Debugging: Show the most common nouns, verbs, and adjectives
print("Most frequent nouns:", noun_counts.most_common(10))
print("Most frequent verbs:", verb_counts.most_common(10))
print("Most frequent adjectives:", adj_counts.most_common(10))

# Split the text into sentences based on '。' (full stop)
sentences = [sentence.strip() for sentence in text.split("。") if len(sentence.strip()) > 0]

# Rank sentences based on the frequency of important words (nouns, verbs, adjectives)
sentence_scores = []

for sentence in sentences:
    sentence_tokens = tokenizer_obj.tokenize(sentence, mode)
    
    # Extract nouns, verbs, and adjectives from the sentence
    sentence_nouns = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '名詞']
    sentence_verbs = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '動詞']
    sentence_adjectives = [token.surface() for token in sentence_tokens if token.part_of_speech()[0] == '形容詞']
    
    # Calculate sentence score based on frequency of nouns, verbs, and adjectives
    score = (
        sum([noun_counts.get(noun, 0) for noun in sentence_nouns]) + 
        sum([verb_counts.get(verb, 0) for verb in sentence_verbs]) + 
        sum([adj_counts.get(adj, 0) for adj in sentence_adjectives])
    )
    
    # Append sentence with its score
    sentence_scores.append((sentence, score))

# Debugging: Show sentence scores
print("\nSentence scores:")
for sentence, score in sentence_scores:
    print(f"Sentence: {sentence} | Score: {score}")

# Sort sentences by score in descending order (higher score is more important)
sorted_sentences = sorted(sentence_scores, key=lambda x: x[1], reverse=True)

# Select the top N sentences (you can adjust N)
top_n_sentences = 3
summary_sentences = [sentence for sentence, score in sorted_sentences[:top_n_sentences]]

# Join the top sentences to create the summary
summary = "。".join(summary_sentences) + "。"

# Print the summary
print("\nSummary:")
print(summary)
