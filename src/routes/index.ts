import { FastifyInstance } from "fastify";
import authRoute from "./auth";

const routes = async(fastify: FastifyInstance) => {
    // route에 register를 설정할 때는 반드시 await으로 처리
    await fastify.register(authRoute, {prefix: "/auth"})
}

export default routes;