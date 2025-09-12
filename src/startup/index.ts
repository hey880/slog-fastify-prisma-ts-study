import db from "../lib/db"
import { generateHash } from "../lib/authHelper"
import { FIRST_PWD } from "../lib/constants"

// 편의상 서버 시작 시 사용자를 db에 추가함
const checkStartupUser = async () => {
    const pwd = FIRST_PWD as string
    const hashPwd = generateHash(pwd)
    const userCount = await db.user.count({})
    
    if(userCount === 0) {
        let count = 1
        let maxCount = 1

        while(count <= maxCount) {
            const value = {
                email: `user${count}@email.com`,
                password: hashPwd,
            }

            await db.user.create({
                data: value
            })

            count += 1
        }

        console.log(`created startup user!!!!`)
    }
}

// 편의상 서버 시작 시 게시글을 db에 추가함
const checkStartupArticle = async () => {
    const articleCount = await db.article.count({})

    if(articleCount === 0) {
        const user = await db.user.findFirst({
            orderBy: {
                id: "asc"
            }
        })

        if(user) {
            let count = 1
            const maxCount = 50

            while(count <= maxCount) {
                let values = {
                    content: `content_${count}`,
                    userId: user.id,
                }

                await db.article.create({
                    data: values
                })

                count += 1
            }

            console.log(`created startup articles!!!!`)
        } else {
            await checkStartupUser()
            await checkStartupArticle()
        }
    }
}

export {
    checkStartupUser,
    checkStartupArticle
}