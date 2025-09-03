import Fastify from "fastify"

const fastify = Fastify();

// tsx 사용 안하는 경우는 아래와같이 실행
// nodemon --watch 'src/' --exec node --loader ts-node/esm src/main.ts --verbose
fastify.get("/ping", async (request, reply) => {
    return "pong\n";
})

const start  = async () => {
    try{
       await fastify.listen({port: 8083});
       console.log(`Server Start!!`)
    } catch(error) {
        fastify.log.error(error)
        process.exit(1);
    }
}
