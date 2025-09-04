import { FastifyReply } from "fastify";

// 함수를 만들어서 오류를 처리하는 이유는 서버에서 발생하는 모든 오류를 바로 사용자에게 전달할 필요가 없기 때문
export function handleError(rep: FastifyReply, errorType: {success: boolean, status: number, message: string}, error?: any) {
    rep.log.error(error) // server log에 에러 기록
    rep.status(errorType.status).send(errorType) // 사용자에게 에러 전달
}