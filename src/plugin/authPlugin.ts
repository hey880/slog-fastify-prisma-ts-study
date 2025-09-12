import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify"
import { verifyAccessToken, shortVerifyRefreshToken } from "../lib/authHelper"
import fp from "fastify-plugin"
import { TCommonHeaders } from "../schema/types"

const currentlyAuth: FastifyPluginAsync = async (fastify) => {
    // fastify decorateRequest에 특정 값을 설정하면 fastify request에서 설정한 값을 가져오거나 주입할 수 있게된다.
    fastify.decorateRequest("user", null)
    fastify.addHook("preHandler", async (req:FastifyRequest<{Headers: TCommonHeaders}>) => {
        const { authorization } = req.headers
        const refresh_token = req.cookies.refresh_token
        
        if(!authorization || !refresh_token) return

        try {
            shortVerifyRefreshToken(refresh_token)
            const decode = verifyAccessToken(authorization)

            req.user = {
                id: decode.id,
                email: decode.email
            }
        } catch (error) {
            return
        }
    })
}

export const currentlyAuthPlugin = fp(currentlyAuth, {
    name: "currentlyAuthPlugin"
})

// interface를 사용해서 request에 타입을 주입
declare module "fastify" {
    interface FastifyRequest {
        user: {
            id: number,
            email: string,
        } | null
    }
}