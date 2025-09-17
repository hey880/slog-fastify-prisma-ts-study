import { Static } from "@sinclair/typebox";
import { authBodySchema } from "../authSchema";
import { commonHeadersSchema, articleSchema, commonBodySchema } from "../commonSchema";

type TAuthBody = Static<typeof authBodySchema>
type TCommonHeaders = Static<typeof commonHeadersSchema>
type TArticle = Static<typeof articleSchema>
type TCommonBody = Static<typeof commonBodySchema>

export {
    TAuthBody,
    TCommonHeaders,
    TArticle,
    TCommonBody,
}