import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema, logoutSchema } from "../../schema";
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
            // fastify의 rep를 사용하여 void 형태로 처리하는 것이 좋다. rep를 사용하면 return type이 Promise<void>로 추론된다.
            rep.status(SUCCESS_MESSAGE.registerOk.status).send(SUCCESS_MESSAGE.registerOk)
        }catch(error){
            handleError(rep, ERROR_MESSAGE.badRequest, error)
        }
    })

    fastify.post("/login", {schema: loginSchema}, async(req: FastifyRequest<{Body: TAuthBody}>, rep: FastifyReply) => {
        const { email, pwd } = req.body
        try {
            const values = await authService.loginWithPassword(email, pwd)
            
            // refresh token을 refresh_token이라는 이름으로 저장
            rep.setCookie("refresh_token", values.refreshToken, {
                domain: "localhost",
                sameSite: "none",
                secure: true,
                path: "/",
                // httpOnly가 true로 적용된 쿠키는 브라우저에서 자바스크립트로 쿠키를 못읽어 
                // 브라우저에서 실행되는 코드에서 쿠키가 탈취될 위험을 줄여준다.
                httpOnly: true,
                // expires는 7일로 설정했기 때문에 현재 날짜에 7일에 해당하는 값을 더해줘야함.
                // 1000은 1초를 의미. 즉, 아래 식은 24시간 * 7 로 7일을 의미
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            })

            const result = {
                id: values.id,
                email: values.email,
                Authorization: values.accessToken,
            }
            rep.status(201).send(result)
        } catch(error) {
            handleError(rep, ERROR_MESSAGE.badRequest, error)
        }
    })

    fastify.delete("/logout", { schema: logoutSchema }, async(req: FastifyRequest, rep: FastifyReply) => {
        const refresh_token = req.cookies.refresh_token
        if(!refresh_token) {
            handleError(rep, ERROR_MESSAGE.unauthorized)
            return
        }

        try {
            await authService.logout(refresh_token)
            rep.clearCookie("refresh_token", {path: "/"}) // cookie 초기화
            rep.status(SUCCESS_MESSAGE.logoutOk.status).send(SUCCESS_MESSAGE.logoutOk)
        } catch(error) {
            handleError(rep, ERROR_MESSAGE.badRequest, error)
        }
    })
}

export default authRoute;