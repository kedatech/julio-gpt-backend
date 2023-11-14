import { Request, Response } from "express"
import { AIMessage, HumanMessage } from "langchain/schema"
import { getPinecone } from "../shared/utils/pinecone-client"
import { makeChain } from "../shared/utils/makechain"
import { envConfig } from "../shared/config/env"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PineconeStore } from "langchain/vectorstores/pinecone"

const { PINECONE_INDEX_NAME } = envConfig

export const chatHandler = async (req: Request,res: Response): Promise<void> => {
	const pinecone = await getPinecone()
	const { question, history } = req.body

	console.log("question", question)
	console.log("history", history)
	console.log("PIN", PINECONE_INDEX_NAME)


	if (!question) {
		res.status(400).json({ message: "No hay pregunta en la solicitud" })
	}

	// OpenAI recomienda reemplazar saltos de línea con espacios para obtener mejores resultados
	const sanitizedQuestion = question.trim().replaceAll("\n", " ")

	try {
		const index = pinecone.Index(PINECONE_INDEX_NAME)

		// Crear vectorstore
		const vectorStore = await PineconeStore.fromExistingIndex(
			new OpenAIEmbeddings({}),
			{
				pineconeIndex: index,
				textKey: "text",
				// namespace: PINECONE_NAME_SPACE, //namespace viene de tu carpeta de configuración
			}
		)

		// Crear cadena
		const chain = makeChain(vectorStore)

		const pastMessages = history.map((message: string, i: number) => {
			if (i % 2 === 0) {
				return new HumanMessage(message)
			} else {
				return new AIMessage(message)
			}
		})

		// Hacer una pregunta usando el historial de chat
		const response = await chain.call({
			question: sanitizedQuestion,
			chat_history: pastMessages,
		})

		let explicitMessage = false
		if(response.text = "No se permiten mensajes ofensivos u explicitos"){
			explicitMessage = true;
		}

		console.log("response", response)
		res.status(200).json({...response, explicitMessage})
	} catch (error: any) {
		console.log("error", error)
		res.status(500).json({ error: error.message || "Algo salió mal" })
	}
}
