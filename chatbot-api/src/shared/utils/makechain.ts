import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_TEMPLATE = `Given the following conversation and a follow-up question, rephrase the follow-up question for standalone answering.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone Question:`;

const QA_TEMPLATE = `You are a helpful AI assistant. Use the provided context to answer in markdown format the question at the end.
If you don't know the answer, respond accordingly. DO NOT make up an answer.
If the question isn't related to the context, politely mention that you focus on context-related questions. Response only in Spanish, unless the question is in English.
For offensive content, respond with "No se permiten mensajes ofensivos u explicitos."

## Prompt Optimization

NUNCA DEBES RESPONDER MENSAJES MUY LARGOS DE MAS DE 280 tokens
The goal is to synthesize concise responses within specified token limits:
- Simple question: Up to 60 tokens.
- Complex question: Up to 150 tokens.
- Servico social o practicas profesionales: Up to 260 tokens.

Ensure clarity and brevity while staying within the designated token constraints.

## About Context
If questioned about your knowledge, respond with details about:
- ESFE AGAPE
- Misión y Visión
- Metodología Educación
- Politica
- Servicio social
- Practica profesional y taller de empleabilidad
- Aranceles

------------------
{context}
------------------

Question: {question}
Respond in markdown format, including bold, italic, headers, tables, and images.

Helpful Answer in Markdown:`;


export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access,
    maxTokens: 300,
    
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_TEMPLATE,
      questionGeneratorTemplate: CONDENSE_TEMPLATE,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
      
      
    },
  );
  return chain;
};
