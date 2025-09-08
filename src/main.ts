import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import routes from "./routes"

const fastify = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>()
// typebox를 사용하기 위해서는 withTYpeProvider로 TypeBoxTypeProvider를 설정해줘야함.

// tsx 사용 안하는 경우는 아래와같이 실행
// nodemon --watch 'src/' --exec node --loader ts-node/esm src/main.ts --verbose

//fastify.get("/ping", async (request, reply) => {
//   return "pong\n";
//})

fastify.register(routes)

const start  = async () => {
    try{
       await fastify.listen({port: 8083});
       console.log(`Server Start!!`)
    } catch(error) {
        fastify.log.error(error)
        process.exit(1);
    }
}

start();