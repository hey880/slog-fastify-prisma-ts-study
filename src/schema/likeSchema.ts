import { Type } from "@sinclair/typebox";
import { commonHeadersSchema, commonQuerySchema, commonParamSchema, commonPagenationSchema } from "./commonSchema";

const headers = commonHeadersSchema
const querystring = commonQuerySchema
const params = commonParamSchema

const addLikeSchema = {
    headers,
    params,
    response: {
        200: Type.Boolean()
    }
}

const cancelLikeSchema = {
    headers,
    params,
    response: {
        200: Type.Boolean()
    }
}

const readLikeSchema = {
    headers,
    querystring,
    response: {
        200: commonPagenationSchema
    }
}

export {
    addLikeSchema,
    cancelLikeSchema,
    readLikeSchema,
}