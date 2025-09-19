import { TArticle } from "../schema/types"
import db from "./db"

// 게시글 수정 시 게시글 작성자와 수정하려는 사용자가 같은 사용자인지 확인
const verifyArticleUser = async ( articleId: number, userId: number ) => {

    let result = false

    try {
        const article = await db.article.findUnique({
            where: {
                id: articleId
            },
            select: {
                userId: true
            }
        })

        if (article) {
            result = article.userId === userId ? true : false
        }

        return result
    } catch (error) {
        return false
    }
}

// '좋아요'한 글을 표시하는 기능
const likeCompareArticles = async (articles:TArticle[], userId: number) => {
    type TArticlesIds = {
        articleId: number
    }

    const articlesIds = articles.map(article => article.id)

    let likes: TArticlesIds[] = await db.like.findMany({
        where: {
            userId: userId,
            articleId: {
                in: articlesIds
            }
        },
        select: {
            articleId: true
        }
    })

    const verifyLikeMe = (article: TArticle, likes: TArticlesIds[]) => {
        article.likeMe = false
        // some은 반복문으로 조건 (like의 articleId와 같은 id를 가진 article)에 맞는 값을 발견하면
        // 순회를 멈추고 true를 반환
        const likeArticle = likes.some(like => like.articleId === article.id)
        if (likeArticle) article.likeMe = true // article의 like 표시를 true로 업데이트

        return article
    }

    const articlesWithLike:TArticle[] = articles.map(article => verifyLikeMe(article, likes))
    return articlesWithLike
}

export { verifyArticleUser, likeCompareArticles }