import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { registerSchema } from "../../schema";
import { TAuthBody } from "../../schema/types";
import authService from "../../services/authService";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../lib/constants";
import { handleError } from "../../lib/errorHelper";

// 인증관련 route
// fastify의 route는 기본 인자로 FastifyInstance 타입을 가지는 인자가 와야하고
// 비동기 처리를 위해 async-await을 사용해야함.
const authRoute = async (fastify: FastifyInstance) => {
    // fastify에서 req, resp를 처리하기 위해서는 req, resp 관련 타입을
    // fastify에서 가져와 내용을 추가해 사용해야함.
    // request body에 담길 email, pw는 우리가 정의한 값이므로 제네릭으로
    // 타입을 주입해줘야함.
    fastify.post("/register", {schema: registerSchema}, async (req: FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
        const { email, pwd } = req.body // registerSchema에서 값의 유무는 이미 확인됨 (기본 정의가 required)

        try {
            await authService.register(email, pwd)
            // router에서 응답값을 직접 return하면 return값에 대한 타입 정의를 모두 해야하는 번거로움이 있기 때문에
            // fastify의 rep를 사용하는 것이 좋다. rep를 사용하면 return type이 Promise<void>로 추론된다.
            rep.status(SUCCESS_MESSAGE.registerOk.status).send(SUCCESS_MESSAGE.registerOk)
        }catch(error){
            handleError(rep, ERROR_MESSAGE.badRequest, error)
        }
    })
}

export default authRoute;