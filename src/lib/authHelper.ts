import bcrypt from "bcrypt";
import db from "./db";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ERROR_MESSAGE, ROUND, SECRET_KEY, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from "./constants";

const generateHash = ( pwd: string ) => {
    const hashPwd = bcrypt.hashSync(pwd, ROUND);
    return hashPwd
}

// 중복 이메일 체크 함수
const duplicateVerifyUser = async (email:string) => {
    try {
        const userCount = await db.user.count({
            where: {
                email: email
            }
        })
        
        if (userCount >  0) throw ERROR_MESSAGE.alreadySignup

        return true
    } catch (error) {
        throw error
    }
}

const verifyPassword = async (email:string, pwd:string) => {
    try{
        const encryptedPwd = await db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                password: true // password 컬럼만 조회
            }
        })
        // 비밀번호가 없으면 false를 반환
        if(!encryptedPwd) return false;
        // req로 넘어온 비밀번호가 db에 저장된 비밀번호와 같은지 비교
        // compareSync는 암호화된 값과 특정값을 비교해 참 거짓인지에 따라 true, false를 return한다.
        const result = bcrypt.compareSync(pwd, encryptedPwd.password)
        return result;
    } catch (error) {
        console.error(error)
        return false;
    }
}

const generateAccessToken = (user: { id: number, email: string}) => {
    // jwt.sign : bcrypt와 다르게 복호화가 가능한 형태로 암호화
    const accessToken = jwt.sign({ id: user.id, email: user.email}, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES})
    return accessToken
}

const generateRefreshToken = (user: {id: number, email: string}) => {
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRES})
    return refreshToken
}

const verifyRefreshToken = async( refresh_token: string ) => {
    // 서버에 해당 토큰으로 로그인된 정보가 있는지 확인 후 있으면 평문화 된 token 내용을 반환
    try {
        const decoded = jwt.verify(refresh_token, SECRET_KEY) as JwtPayload
        const tokenFromServer = await db.token.count({
            where: {
                userId: decoded.id,
                refreshToken: refresh_token,
            }
        })
        if (tokenFromServer > 0) {
            return decoded
        } else {
            throw ERROR_MESSAGE.unauthorized
        }
    } catch (error) {
        throw ERROR_MESSAGE.unauthorized
    }
}

export {
    generateHash,
    duplicateVerifyUser,
    generateAccessToken,
    generateRefreshToken,
    verifyPassword,
    verifyRefreshToken,
}
