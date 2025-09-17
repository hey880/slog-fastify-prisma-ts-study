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

export { verifyArticleUser }