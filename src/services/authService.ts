import db from "../lib/db";
import { generateHash, duplicateVerifyUser } from "../lib/authHelper";

// 실제 가입 처리 기능
// service로 정의되는 함수들은 여러군데서 쓰이기보다 같은 동작을 하는 곳에서
// 쓰이기 때문에 메인 함수 하위에 method 형태로 만들어 method들을 return하고 
// 메인 함수를 export 시키는 방식으로 정의
function authService() {
    const register = async (email:string, pwd: string) => {
        try {
            await duplicateVerifyUser(email)

            const hashPwd = generateHash(pwd)

            const values = {
                email: email,
                password: hashPwd
            }
            // db 처리는 await로 처리할것.
            const returnValue = await db.user.create({
                data: values
            })

            return returnValue
        } catch (error) {
            throw error
        }
    }

    return { register }
}

export default authService();