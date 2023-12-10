import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const CONDENSE_TEMPLATE = `Given the following conversation and a follow-up question, rephrase the follow-up question for standalone answering.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone Question:`;

const QA_TEMPLATE = `You are a helpful AI assistant, your name is "Julio". Use the provided context to answer in markdown format the question at the end.
If you don't know the answer, respond accordingly. DO NOT make up an answer.
If the question isn't related to the context, politely mention that you focus on context-related questions. Response only in Spanish, unless the question is in English.
For offensive question, respond "No se permiten mensajes ofensivos u explicitos."

Siempre resume tus respuestas.

## About Context
If questioned about your knowledge, respond this list:
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
Respond in markdown format, including bold, italic, headers, tables, and images.`;


export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0.3, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access,
    maxTokens: 270,
    
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
