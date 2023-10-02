import LoginForm from "@/components/forms/Login"
import RegisterForm from "@/components/forms/Register"
import { NextPageContext } from "next";
import { getCsrfToken, getProviders } from "next-auth/react";

export default function auth({ tab, callbackUrl, csrfToken, providers  } : { 
    tab: string,
    callbackUrl: string,
    csrfToken: string,
    providers: any
}) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full h-100 flex items-center justify-center">
                {/*----Form----*/}
                <div className="w-full sm:w5/6 md:w-2/3 lg:w1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex flex-col items-center justify-center">
                    {
                        tab == "signin" ? (
                            <LoginForm callbackUrl={callbackUrl} csrfToken={csrfToken}/>
                        ) : (
                            <RegisterForm/>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx: NextPageContext) {
    //מהקונטקסט query-אחזור הבקשה וה
    const { req, query } = ctx
    //שיוצג כברירת מחדל - התחברות או הרשמה tab-קביעת ה
    const tab = query.tab ? query.tab : "signin"
    //query-לחזרה בברירת מחדל או מה URL קביעת
    const callbackUrl = query.callbackUrl ? query.callbackUrl : process.env.NEXTAUTH_URL
    //עבור הטופס CSRF אחזור אסימן האבטחה
    /*
        CSRF = Cross-Site Request Forgery:
        אסימן הבטחה הוא סוג של התקפה שבה אתר זדוני מנסה לבצע פעולות
        .לא חוקיות מטעם המשתמש המחובר לאתר 
        לדוגמא, אתר זדוני יכול לנסות לשלוח בקשת פוסט לאתר אחר עם פרטי
        .המשתמש המחובר כדי לעשות פעולות כמו העברת כסף או שינוי סיסמא
        .ייחודי לכל בקשה CSRF כדי למנוע זאת, השרת יוצר ומאמת אסימן
        .האסימן מיוצר בצד שרת ומועבר ללקוח בכל בקשה
        .כאשר הטופס נשלח, האסימן נשלח בחזרה ומאומת בשרת, אם הוא חסר או לא תקף, הבקשה נחסמת
    */
    const csrfToken = await getCsrfToken(ctx)
    //אחזור רשימת ספרי אימות
    const providers = await getProviders()
    //עם הנתוונים האלה שיועברו לעמוד ההתחברות props החזרת אובייקט
    return {
        props: {
            providers: Object.values(providers!),
            tab: JSON.parse(JSON.stringify(tab)),
            callbackUrl,
            csrfToken,
        }
    }
}