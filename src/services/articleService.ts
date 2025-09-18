import db from "../lib/db"
import { TArticle } from "../schema/types"
import { getCurrentDate } from "../lib/timeHelper"
import { ERROR_MESSAGE } from "../lib/constants"
import { verifyArticleUser } from "../lib/articleHelper"

function articleService() {
    const createArticle = async (id:number, email:string, content: string) => {
        try {
            const values = {
                content: content,
                userId: id,
                createdAt: getCurrentDate() // 그냥 new Date 사용하면 시차 생길 수 있으므로 UTC로 변환
            }
            const result = await db.article.create({
                data: values
            })

            const returnValue:TArticle = {
                ...result,
                userEmail: email,
                likeMe: false,
                // prisma에서 Date 타입으로 보내지는데 string으로 변환하는 게 사용이 편하다.
                // 그리고 TArticle을 보면 createdAt은 string 타입으로 정의했기 때문에 string으로 변환해줘야함.
                createdAt: result.createdAt.toString()
            }

            return returnValue
        } catch (error) {
            throw error
        }
    }

    const updateArticle = async (articleId: number, content: string, userId: number, email:string) => {
        try {
            const checkVerifyUser = await verifyArticleUser(articleId, userId)
            if (checkVerifyUser) {
                const result = await db.article.update({
                    where: {
                        id: articleId,
                    },
                    data: {
                        content: content,
                    }
                })

                const returnValue:TArticle = {
                    ...result,
                    userEmail: email,
                    likeMe: false,
                    createdAt: result.createdAt.toString()
                }

                return returnValue
            } else {
                throw ERROR_MESSAGE.badRequest
            }
        } catch (error) {
            throw error
        }
    }

    const deleteArticle = async(articleId: number, userId: number) => {
        try {
            const checkVerifyUser = await verifyArticleUser(articleId, userId)
            if (checkVerifyUser) {
                const result = await db.article.delete({
                    where: {
                        id: articleId,
                    }
                })

                return result
            } else {
                throw ERROR_MESSAGE.badRequest
            }
        } catch (error) {
            throw error
        }
    }

    return { createArticle, updateArticle, deleteArticle }
}

export default articleService();