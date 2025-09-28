import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { fastifyCookie, type FastifyCookieOptions } from "@fastify/cookie"
import routes from "./routes"
import { SECRET_KEY } from "./lib/constants"
import { currentlyAuthPlugin } from "./plugin/authPlugin"
import { checkStartupUser, checkStartupArticle } from "./startup"
import fs from "fs";

const fastify = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.crt"),
    }
}).withTypeProvider<TypeBoxTypeProvider>()
// typebox를 사용하기 위해서는 withTYpeProvider로 TypeBoxTypeProvider를 설정해줘야함.

// tsx를 사용하는 영우는 아래와 같이 build:live 값을 설정한다.
// "build:live": "npx tsx src/main.ts"
//fastify.get("/ping", async (request, reply) => {
//   return "pong\n";
//})

fastify.register(fastifyCookie, {
    secret: SECRET_KEY,
} as FastifyCookieOptions)

fastify.register(currentlyAuthPlugin)
fastify.register(routes)

const start  = async () => {
    try{
        await checkStartupUser()
        await checkStartupArticle()
        await fastify.listen({port: 8083});
        console.log(`Server Start!!`)
    } catch(error) {
        fastify.log.error(error)
        process.exit(1);
    }
}

start();