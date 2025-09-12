import { Type } from "@sinclair/typebox"

const commonHeadersSchema = Type.Object({
    // 로그인 하지 않은 사용자는 해당 값이 정의 되지 않기 때문에 Optional로 타입 설정
    authorization: Type.Optional(Type.String())
})

export {
    commonHeadersSchema
}