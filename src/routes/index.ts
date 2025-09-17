import { FastifyInstance } from "fastify";
import authRoute from "./auth";
import articleRoute from "./article";

const routes = async(fastify: FastifyInstance) => {
    // route에 register를 설정할 때는 반드시 await으로 처리
    await fastify.register(authRoute, {prefix: "/auth"})
    await fastify.register(articleRoute, {prefix: "/articles"})
}

export default routes;