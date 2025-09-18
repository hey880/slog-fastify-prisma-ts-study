import { Static } from "@sinclair/typebox";
import { authBodySchema } from "../authSchema";
import { commonHeadersSchema, articleSchema, commonBodySchema, commonParamSchema } from "../commonSchema";

type TAuthBody = Static<typeof authBodySchema>
type TCommonHeaders = Static<typeof commonHeadersSchema>
type TArticle = Static<typeof articleSchema>
type TCommonBody = Static<typeof commonBodySchema>
type TCommonParam = Static<typeof commonParamSchema>

export {
    TAuthBody,
    TCommonHeaders,
    TArticle,
    TCommonBody,
    TCommonParam,
}