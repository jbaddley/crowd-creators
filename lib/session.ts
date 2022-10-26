import { CookieSerializeOptions, parse, serialize } from 'cookie'
import { createLoginSession, getLoginSession } from './auth'

function parseCookies(req: any) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export const getToken = (req: any, name: string) => {
    const cookies = parseCookies(req)
    const token = cookies[name]
    return token
}

export const getSession = async (req: any, name: string, secret: string) => {
    const token = getToken(req, name)
    let unsealed = {}

    if (token) {
      try {
        // the cookie needs to be unsealed using the password `secret`
        unsealed = await getLoginSession(token, secret)
      } catch (e) {
        // The cookie is invalid
      }
    }

    return unsealed;
}

export const setCookie = (req: any, res: any) => (name: string, value: any, cookieOpts?: CookieSerializeOptions) => {
    const oldEnd = res.end
    res.end = function resEndProxy(...args: any) {
      if (res.finished || res.writableEnded || res.headersSent) {
        console.error('NOPE')
        return
      }
      if (cookieOpts?.maxAge) {
        req.session.maxAge = cookieOpts.maxAge
      }
      req[name] = value
      res.setHeader('Set-Cookie', serialize(name, value, cookieOpts))
      oldEnd.apply(this, args)
    }
    return res
}

export default function session({ name, secret, cookie: cookieOpts }: any) {
  return async (req: any, res: any, next: any) => {

    req.session = await getSession(req, name, secret)
    const token = await createLoginSession(req.session, secret, req?.user?.id)
    setCookie(req, res)(name, token, cookieOpts)

    next()
  }
}

export function sessionUser(cookieOpts?: CookieSerializeOptions) {
    return async (req: any, res: any, next: any) => {
  
      setCookie(req, res)('passport-user', JSON.stringify(req.user), cookieOpts)
  
      next()
    }
  }
