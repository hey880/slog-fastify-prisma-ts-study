import db from "../lib/db"
import { getCurrentDate } from "../lib/timeHelper"
import { TArticle } from "../schema/types"

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
    return { createArticle }
}

export default articleService();