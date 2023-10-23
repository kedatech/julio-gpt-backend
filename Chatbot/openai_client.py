import openai
import json
from secreet import OPENAI_API_KEY  # Asegúrate de que esta variable contenga la URL correcta
import re
import urllib.parse

openai.api_key = OPENAI_API_KEY

def create_chat_completion(document, question):
    messages = []

    system_content = """
You are an assistance bot in Latin Spanish for ESFE AGAPE. Your role is to provide information and assistance exclusively related to ESFE AGAPE. Please do not respond to questions outside of this topic or engage in mathematical inquiries. Your focus is solely on assisting with ESFE AGAPE-related queries.
I am Julio, the Capybara assistant of ESFE AGAPE. Whenever I respond, it will be in the manner of "Soy Julio la Capibara, asistente de ESFE Agape."
If you encounter offensive responses, please inform the user that you are an assistant of ESFE and can report such messages.
You may use any emoji if needed.
Please refrain from providing locations or social media information. If asked questions that are unrelated to the ESFE AGAPE institution, kindly excuse yourself by stating that they are outside the scope of your knowledge.
"\n\n"""
    
    print(document)
    for item in document:
        
        system_content += f"```\n{item}\n```\n"
        # print(system_content + " ITERATED")

    system_content += """
    Please provide detailed instructions on how the AI should 
    interact with users, what information it should provide, and 
    how it should handle various scenarios, ensuring a friendly and professional communication style. 
    Consider the following points. Only just response questions of the information provided. All offensives, Theme Off, 
    no help need questions, ignore them.
    """

    messages.append({"role": "system", "content": system_content})

    prompt = question

    messages.append({"role": "user", "content": prompt})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=1,
            max_tokens=1000
        )

        if response.choices and len(response.choices) > 0:
            return response.choices[0].message["content"]
        else:
            return None
    except Exception as error:
        print(error)
        return None
    
    
    
class TextBlock:
    def __init__(self, isCodeBlock, text, language=None):
        self.isCodeBlock = isCodeBlock
        self.text = text
        self.language = language

def parse_text(text)->TextBlock:
    regex = r'```([\w-]+)?\s*([\s\S]+?)\s*```'
    blocks:TextBlock = []
    last_index = 0

    for match in re.finditer(regex, text):
        full_match, language, code = match.groups()
        pre_match = text[last_index:match.start()]

        if pre_match:
            blocks.append({'isCodeBlock': False, 'text': pre_match})

        blocks.append({'isCodeBlock': True, 'text': code, 'language': language})
        last_index = match.end()

    last_block = text[last_index:]

    if last_block:
        blocks.append({'isCodeBlock': False, 'text': last_block})

    return blocks





async def createquery(d, q):
    completion = create_chat_completion(d, q)
    if completion:  # Convierte el diccionario en JSON
        return completion


async def queryLLM(document, question, metadata):
    answer = await createquery(document, question)
    parsed = parse_text(answer)
    response = {"text":parsed[0]["text"], "meta":metadata, "question":urllib.parse.unquote(question)}
    return  json.dumps(response)

    

async def queryEmbeddings(query, response):
    
    if response:
        result = response
        documents = result['documents'][0]
        metadatas = result['metadatas'][0]
        return await queryLLM(documents, query, metadatas)  # Supongo que queryLLM es una función que deseas llamar después
    else:
        print('Error al hacer la solicitud:', response.status_code)