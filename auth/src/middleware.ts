import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/*
    middleware(req: NextRequest):
    פונקציה המשמשת לטיפול באימות משתמשים באופן הבא:
    1. משיגה את הנתיב הנוכחי וכתובת המקור שך הבקשה.
    2. getToken בודקת אם יש טוקן תקף של משתמש מוכר באמצעות הפונקציה.
    3. "/auth" אם הנתיב הוא לדף הבית "/" ואין טוקן, מבוצע ניתוב מחדש לדף ההתחברות.
    4. ויש טוקן תקף, מבוצע ניתוב מחדש חזרה לדף הבית "/auth" אם הנתיב הוא לדף ההתחברות.

    לסיכום - הפונקציה מוודאה שמשתמשים לא מאומתים יועברו לדף ההתחברות ומשתמשים מאומתים לא יוכלו לגשת שוב לדף ההתחברות.
*/
export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production"
    })
    if(pathname == "/"){
        if(!session) return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth`)
    }
    if(pathname == "/auth"){
        if(session) return NextResponse.redirect(`${origin}`)
    }
}