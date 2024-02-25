import warnings

# Globally suppress all warnings
warnings.filterwarnings("ignore")

# Or, selectively suppress specific warnings
warnings.filterwarnings("ignore", message="Unsupported Windows version*")
warnings.filterwarnings("ignore", message="n_jobs value*")

import chromadb
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter, SentenceTransformersTokenTextSplitter
import numpy as np
from tqdm import tqdm
from pypdf import PdfReader
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from sentence_transformers import CrossEncoder
# import umap.umap_ as umap
from IPython.display import display
from IPython.display import Markdown
import google.generativeai as genai
import textwrap

# helper functions
def word_wrap(string, n_chars=72):
    # Wrap a string at the next space after n_chars
    if len(string) < n_chars:
        return string
    else:
        return string[:n_chars].rsplit(' ', 1)[0] + '\n' + word_wrap(string[len(string[:n_chars].rsplit(' ', 1)[0])+1:], n_chars)

def project_embeddings(embeddings, umap_transform):
    umap_embeddings = np.empty((len(embeddings),2))
    for i, embedding in enumerate(tqdm(embeddings)): 
        umap_embeddings[i] = umap_transform.transform([embedding])
    return umap_embeddings


def load_chroma(filename, collection_name, embedding_function):
    texts = _read_pdf(filename)
    chunks = _chunk_texts(texts)
    chroma_cliet = chromadb.Client()
    chroma_collection = chroma_cliet.create_collection(name=collection_name, embedding_function=embedding_function)
    ids = [str(i) for i in range(len(chunks))]
    chroma_collection.add(ids=ids, documents=chunks)
    return chroma_collection


def _chunk_texts(texts):
    character_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", ". ", " ", ""],
        chunk_size=1000,
        chunk_overlap=300
    )
    character_split_texts = character_splitter.split_text('\n\n'.join(texts))
    token_splitter = SentenceTransformersTokenTextSplitter(chunk_overlap=0, tokens_per_chunk=256)
    token_split_texts = []
    for text in character_split_texts:
        token_split_texts += token_splitter.split_text(text)

    return token_split_texts


def _read_pdf(filename):
    reader = PdfReader(filename)
    pdf_texts = [p.extract_text().strip() for p in reader.pages]
    # Filter the empty strings
    pdf_texts = [text for text in pdf_texts if text]
    return pdf_texts

embedding_function = SentenceTransformerEmbeddingFunction()
chroma_collection = load_chroma(filename = 'Solutions.pdf', collection_name='Solutions', embedding_function=embedding_function)
chroma_collection.count()

embeddings = chroma_collection.get(include=['embeddings'])['embeddings']

def augment_query_generated(query):
    genai.configure(api_key="PUT YOUR API KEY")
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(f'''You are a helpful chemistry teacher. Provide an example 
    answer to the given question, that might be found in a document like an Chemistry Textbook.
    query: '{query}' ''')
    return response.parts[0].text


original_query = "What is Thompsons plum pudding model ?"
hypothetical_answer = augment_query_generated(original_query)
joint_query = f"{original_query} {hypothetical_answer}"

results = chroma_collection.query(query_texts=joint_query, n_results=5, include=['documents', 'embeddings'])

retrieved_documents = results['documents'][0]

retrieved_embeddings = results['embeddings'][0]
original_query_embedding = embedding_function([original_query])
augmented_query_embedding = embedding_function([joint_query])


cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
pairs = [[original_query, doc] for doc in retrieved_documents]
scores = cross_encoder.predict(pairs)

index = np.argsort(scores)

genai.configure(api_key="PUT YOUR API KEY")
model = genai.GenerativeModel('gemini-pro')
response = model.generate_content(f'''Given the context answer the query 
        based on it, context: '{retrieved_documents[index[-1]]}', query:'{original_query}'. IF CONTEXT HAS MISSING WORDS 
        THEN YOU CAN ADD WORDS. BUT MAKE SURE TO USE THE WORDS PRESENT IN THE CONTEXT AND DON'T CHANGE THEM.''')

print(response.parts[0].text)