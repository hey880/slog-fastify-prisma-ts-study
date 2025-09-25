import { Static } from "@sinclair/typebox";
import { authBodySchema } from "../authSchema";
import { commonHeadersSchema, articleSchema, commonBodySchema, commonParamSchema, commonQuerySchema, commonPagenationSchema } from "../commonSchema";
import { commentDeleteBodySchema, commentSchema } from "../commentSchema";

// schema들을 typebox를 이용하여 타입으로 변환 후 export
type TAuthBody = Static<typeof authBodySchema>
type TCommonHeaders = Static<typeof commonHeadersSchema>
type TArticle = Static<typeof articleSchema>
type TCommonBody = Static<typeof commonBodySchema>
type TCommonParam = Static<typeof commonParamSchema>
type TCommonQuery = Static<typeof commonQuerySchema>
type TCommonPagenation = Static<typeof commonPagenationSchema>
type TComment = Static<typeof commentSchema>
type TCommentDeleteBody = Static<typeof commentDeleteBodySchema>

export {
    TAuthBody,
    TCommonHeaders,
    TArticle,
    TCommonBody,
    TCommonParam,
    TCommonQuery,
    TCommonPagenation,
    TComment,
    TCommentDeleteBody,
}