import { Type } from "@sinclair/typebox"

const articleSchema = Type.Object({
    id: Type.Number(),
    content: Type.String(),
    likeCount: Type.Number(),
    commentCount: Type.Number(),
    userId: Type.Number(),
    userEmail: Type.Optional(Type.String()),  // DB에 없는 값이므로 Optional로 처리
    likeMe: Type.Optional(Type.Boolean()), // DB에 없는 값이므로 Optional로 처리
    createdAt: Type.String(),
})

const commonHeadersSchema = Type.Object({
    // 로그인 하지 않은 사용자는 해당 값이 정의 되지 않기 때문에 Optional로 타입 설정
    authorization: Type.Optional(Type.String())
})

// 게시글도 body로 값들이 오가기 때문에 body 정의
const commonBodySchema = Type.Object({
    articleId :  Type.Number(),
    content: Type.String(),
})

export {
    commonHeadersSchema,
    articleSchema,
    commonBodySchema,
}