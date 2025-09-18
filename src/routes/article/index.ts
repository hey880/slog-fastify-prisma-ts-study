import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createArticleSchema, deleteArticleSchema, updateArticleSchema } from "../../schema";
import { TCommonBody, TCommonHeaders, TCommonParam } from "../../schema/types";
import { handleError } from "../../lib/errorHelper";
import { ERROR_MESSAGE } from "../../lib/constants";
import articleService from "../../services/articleService";
import { verifySignin } from "../../lib/authHelper";

const articleRoute = async (fastify:FastifyInstance) => {
    // 다른 route들은 short cut 방식으로 route 정의. 이번에는 명시적으로 route 요소들을 정의.
    fastify.route({
        method: "POST",
        schema: createArticleSchema,
        url: "/",
        preHandler: [verifySignin], // 인증여부를 확인해서 인증이 안된 요청은 handler 실행을 하지 못함
        handler: async (req: FastifyRequest<{Headers:TCommonHeaders, Body:TCommonBody}>, rep:FastifyReply) => {
            const { content } = req.body
            // preHandler에서 인증여부를 검증했기 때문에 req.user에 단언 연산자(!) 사용 가능
            const userId = req.user!.id
            const email = req.user!.email

            try {
                const result = await articleService.createArticle(userId, email, content)
                rep.status(200).send(result)
            } catch (error) {
                handleError(rep, ERROR_MESSAGE.badRequest, error)
            }
        }
    })

    fastify.route({
        method: "PUT",
        url: "/",
        schema: updateArticleSchema,
        preHandler: [verifySignin],
        handler: async(req: FastifyRequest<{Headers: TCommonHeaders, Body: TCommonBody}>, rep: FastifyReply) => {
            const { articleId, content } = req.body
            const userId = req.user!.id
            const email = req.user!.email
            try {
                const result = await articleService.updateArticle(articleId, content, userId, email)
                rep.status(200).send(result)
            } catch(error) {
                handleError(rep, ERROR_MESSAGE.badRequest, error)
            }
        }
    })

    fastify.route({
        method: "DELETE",
        url: `/:articleId`,
        schema: deleteArticleSchema,
        preHandler: [verifySignin],
        handler: async(req: FastifyRequest<{Headers: TCommonHeaders, Params: TCommonParam}>, rep: FastifyReply) => {
            const { articleId } = req.params
            const userId = req.user!.id
            try {
                const result = await articleService.deleteArticle(Number(articleId), userId)
                rep.status(200).send(result)
            } catch (error) {
                throw handleError(rep, ERROR_MESSAGE.badRequest, error)
            }
        }
    })
}

export default articleRoute