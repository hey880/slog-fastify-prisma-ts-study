import { FastifyInstance } from "fastify";
import authRoute from "./auth";
import articleRoute from "./article";
import commentRoute from "./comment";

const routes = async(fastify: FastifyInstance) => {
    // route에 register를 설정할 때는 반드시 await으로 처리
    await fastify.register(authRoute, {prefix: "/auth"})
    await fastify.register(articleRoute, {prefix: "/articles"})
    await fastify.register(commentRoute, {prefix: "/comments"})
}

export default routes;