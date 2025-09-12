import { Secret } from "jsonwebtoken";

const FIRST_PWD = process.env.FIRST_PWD
const ROUND = Number(process.env.HASH_ROUND) // bcrypt에서 비밀번호를 얼마나 복잡하게 할 것인지를 설정하는 값. 숫자가 높을수록 성능저하될 수 있음.
const SECRET_KEY = process.env.SECRET_KEY as Secret // as Secret은 SECRET_KEY를 jwt의 Secret 타입으로 설정하는 구문
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES

// 요청에 실패했을 때의 메시지
const ERROR_MESSAGE = {
  badRequest: {
    success: false,
    status: 400,
    message: 'Bad Request',
  },
  likeAddError: {
    success: false,
    status: 400,
    message: 'Already Add Like'
  },
  likeCancelError: {
    success: false,
    status: 400,
    message: 'No Like'
  },
  unauthorized: {
    success: false,
    status: 401,
    message: 'Unauthorized',
  },
  invalidToken: {
    success: false,
    status: 401,
    message: 'Invalid token'
  },
  notExpired: {
    success: false,
    status: 401,
    message: 'Token Not Expired'
  },
  forbidden: {
    success: false,
    status: 403,
    message: 'Forbidden',
  },
  alreadySignup: {
    success: false,
    status: 403, 
    message: 'Already Sign Up'
  },
  notFound: {
    success: false,
    status: 404,
    message: 'Not Found',
  },
  preconditionFailed: {
    success: false,
    status: 412,
    message: 'Precondition Failed',
  },
  serverError: {
    success: false,
    status: 500,
    message: 'Internal Server Error',
  }, 
} as const // typescript에서는 ~ as const를 쓰면 정의된 값을 바탕으로 그대로 타입이 지정되고 해당 속성들은 read only가 됨

// 요청에 실패했을 때의 메시지
const SUCCESS_MESSAGE= {
  loginOk: {
    success: true,
    status: 201,
    message: 'Login Ok!'
  },
  logoutOk: {
    success: true,
    status: 205,
    message: 'Logout success!'
  },
  refreshToken: {
    success: true,
    status: 201,
    message: 'refresh success'
  },
  accessTokenOk: {
    success: true,
    status: 200,
    message: 'access token ok'
  },
  registerOk : {
    status:201,
    success: true,
    message: 'register success!'
  }
} as const

export {
    FIRST_PWD,
    ROUND,
    SECRET_KEY,
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES,
    ERROR_MESSAGE,
    SUCCESS_MESSAGE
}

// 이 메시지들을 처리할 헬퍼 함수는 lib/errorHelper.ts에 있음