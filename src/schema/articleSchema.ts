import { Type } from "@sinclair/typebox"
import { articleSchema, commonHeadersSchema } from "./commonSchema"

const headers = commonHeadersSchema

const createArticleSchema = {
    headers,
    // body schema 안 갖다쓰고 따로 정의한 이유는 게시글 작성 시 req로 content만 받으면 되기 때문
    body: Type.Object({
        content: Type.String()
    }),
    response: {
        200: articleSchema
    }
}

export {
    createArticleSchema
}