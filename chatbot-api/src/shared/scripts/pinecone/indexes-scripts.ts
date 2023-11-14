import { getPinecone } from '@/shared/utils/pinecone-client'
import { envConfig } from '@/shared/config/env';

const { PINECONE_INDEX_NAME  } = envConfig

export const deleteIndex = async () => {
    try {
        const pinecone = await getPinecone()
        const list = await pinecone.listIndexes();
        console.log("Index: ", list);
        
        if (list.length > 0) {
        const resDel = await pinecone.deleteIndex(PINECONE_INDEX_NAME);
        console.log("resDel: ", resDel);
        }else{
            console.log('No existe ningun indice')
        }
    } catch (error) { 
        console.log('Error de Pinecone: ', error);
        throw new Error('Error al recuperar tus datos');
    }
}

export const createIndex = async () => {
    try {
        const pinecone = await getPinecone()

        const list = await pinecone.listIndexes();
        console.log("Index: ", list);
        
        if (!list.map(el=>el.name).includes(PINECONE_INDEX_NAME)) {
            const resCreate = await pinecone.createIndex({
                  name: PINECONE_INDEX_NAME,
                  dimension: 1536,
                  metric: "cosine"
              });
          
              console.log("resCreate: ", resCreate);
        }else{
            console.log('El indice ya existe');
        }
    } catch (error) { 
        console.log('Error de Pinecone: ', error);
        throw new Error('Error al recuperar tus datos');
    }
}
