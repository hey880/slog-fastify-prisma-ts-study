import db from "../lib/db"
import { FastifyReply, FastifyRequest } from "fastify"
import { TCommentDeleteBody } from "../schema/types"
import { handleError } from "../lib/errorHelper"
import { ERROR_MESSAGE } from "./constants"

// comment 삭제 시 작성자만 삭제할 수 있도록 체크
const compareCommentUser = async (commentId: number, userId: number) => {
    let result = false
    try {
        const comment = await db.comment.findUnique({
            where: {
                id: commentId,
            },
            select: {
                userId: true,
            }
        })

        if (comment) {
            result = comment.userId === userId ? true : false
        }

        return result
    } catch (error) {
        return false
    }
}

// 로그인한 사용자가 해당 코멘트를 작성한 사용자인지 확인
// compareCommentUser가 비동기이기 때문에 이 함수도 비동기로 대응
const verifyCommentUser = async (req: FastifyRequest<{Body: TCommentDeleteBody}>, rep: FastifyReply) => {
    const { commentId } = req.body
    const userId = req.user!.id

    const result = await compareCommentUser(commentId, userId)
    if (!result) handleError(rep, ERROR_MESSAGE.forbidden)
    return
}

export { verifyCommentUser }