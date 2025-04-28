from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def keyword_match(resume_text, job_desc):
    docs = [resume_text, job_desc]
    vec = CountVectorizer().fit_transform(docs)
    score = cosine_similarity(vec[0], vec[1])
    return round(score[0][0] * 100, 2)