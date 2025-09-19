import db from "../lib/db"
import { TArticle, TCommonPagenation } from "../schema/types"
import { getCurrentDate } from "../lib/timeHelper"
import { CATEGORY_TYPE, ERROR_MESSAGE } from "../lib/constants"
import { verifyArticleUser, likeCompareArticles } from "../lib/articleHelper"
import { handleError } from "../lib/errorHelper"

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

    const readArticleOne = async(articleId: number) => {
        try {
            const articleOne = await db.article.findUnique({
                where: {
                    id: articleId
                },
                // includes는 테이블 간 조인을 의미
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        }
                    }
                }
            })
            let returnValue:TArticle | {}
            if (articleOne) {
                returnValue = {
                    ...articleOne,
                    userEmail: articleOne.user.email,
                    likeMe: false,
                    createdAt: articleOne.createdAt.toString()
                }
            } else {
                returnValue = {}
            }
            return returnValue
        } catch (error) {
            throw error
        }
    }

    const readArticlesList = async (pageNumber:number, mode:string, userId?:number) => {
        const pageSize = 10 // limit
        let skip = 0 // offset

        // prisma에서는 skip과 take를 사용해서 pagenation을 구현
        // skip : 앞에 몇개의 글을 스킵할지 설정 (전체 글 개수 중 현재 페이지의 글만 보여주기 위함)
        // take : 가져올 글의 개수

        if (pageNumber > 1) skip = ((pageNumber - 1) * pageSize)
        
            let _where = {}

            if(mode === CATEGORY_TYPE.MY) {
                _where = {userId: userId}
            }

            try {
                const articles = await db.article.findMany({
                    where: _where,
                    include: {
                        // user 테이블과 join하여 id와 email을 가져옴
                        user: {
                            select: {
                                id: true,
                                email: true,
                            }
                        }
                    },
                    orderBy: {
                        id: "desc",
                    },
                    skip: skip,
                    take: pageSize,
                })

                const totalArticleCount = await db.article.count({
                    where: _where
                })
                // 현재 게시글을 기준으로 전체 페이지 수를 계산
                let totalPageCount = Math.ceil(totalArticleCount / pageSize)
                // join된 user 값 및 createdAt을 article 형태에 맞게 변환
                let flattenArticles:TArticle[] = articles.map(article => {
                    return {
                        ...article,
                        userEmail: article.user.email,
                        likeMe: false,
                        createdAt: article.createdAt.toString()
                    }
                })
                // like 표시
                let returnArticles:TArticle[]
                // 로그인 된 사용자라면 해당 사용자가 '좋아요'한 글의 likeMe값을 true로 변환
                if (userId) {
                    returnArticles = await likeCompareArticles([...flattenArticles], userId)
                } else {
                    returnArticles = [...flattenArticles]
                }

                const returnValue:TCommonPagenation = {
                    totalPageCount: totalPageCount,
                    articleList: returnArticles,
                }
                return returnValue
            } catch (error) {
                throw error
            }
    }

    return { 
        createArticle, 
        updateArticle, 
        deleteArticle,
        readArticleOne,
        readArticlesList,
    }
}

export default articleService();