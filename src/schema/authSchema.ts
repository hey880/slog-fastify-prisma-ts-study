import { Type } from "@sinclair/typebox";

// 로그인, 회원가입 기능에 공통으로 사용. 이름을 두군데서 쓰일 수 있게 맞추자
const authBodySchema = Type.Object({
    email: Type.String(),
    pwd: Type.String(),
})

const body = authBodySchema;

// 회원가입 요청에 대한 json schema 검증에 사용
const registerSchema = {
    body,
    response: {
        201: Type.Object({
            status: Type.Number(),
            success: Type.Boolean(),
            messsage: Type.String(),
        })
    }
}

export {
    authBodySchema,
    registerSchema
}