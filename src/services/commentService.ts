import db from "../lib/db"
import { getCurrentDate } from "../lib/timeHelper"
import { ERROR_MESSAGE } from "../lib/constants"
import { TComment } from "../schema/types"

function commentService() {
    const createComment = async (articleId: number, content: string, userId: number, userEmail: string) => {
        try {
            const values = {
                content: content,
                userId: userId,
                articleId: articleId,
                createdAt: getCurrentDate(),
            }

            const result = await db.comment.create({
                data: values
            })

            const newComment = {
                ...result,
                "userId": userId,
                "userEmail": userEmail,
            }

            // comment가 등록된 article의 commentCount 증가
            await db.article.update({
                where: {
                    id: articleId,
                },
                data: {
                    commentCount: {increment: 1}
                }
            })

            return newComment
        } catch (error) {
            throw error
        }
    }

    const readComment = async (articleId: number) => {
        try {
            const comments = await db.comment.findMany({
                where: {
                    articleId: articleId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            })

            let flattenComments:TComment[] = comments.map(comment => {
                return {
                    ...comment,
                    // join한 값은 user라는 키에 object 형태로 저장되기 때문에 이 값을 일반 value 처럼 풀어줌
                    userEmail: comment.user.email,
                    createdAt: comment.createdAt.toString(),
                }
            })

            return {
                comments: flattenComments
            }
        } catch (error) {
            throw error
        }
    }

    const deleteComment = async(articleId: number, commentId: number, userId: number) => {
        try {
            const result = await db.comment.delete({
                where: {
                    id: commentId,
                }
            })

            await db.article.update({
                where: {
                    id: articleId,
                },
                data: {
                    commentCount: {decrement: 1}
                }
            })

            return {
                commentId: result.id
            }
        } catch (error) {
            throw error
        }
    }

    return {
        createComment,
        readComment,
        deleteComment,
    }
}

export default commentService()