import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react"

export default function Home() {
  /*
    useSession():
    .sessionהפונקציה מאתחלת ומחזירה את ה
    .כלומר, מצב שמירה של נתונים ומשתנים לאורך זמן השימוש באפליקציה
    .זה מאפשר לשמור מידע על המשתמש בין בקשות שונות
    .session בהתבסס על logged in/out בכך, הפונקציה מנהלת את מצב ההתחברות של המשתמש
    .הנוכחי של המשתמש ומבטיחה שהוא תקף לפני שממשיכים session הפונקציה מאמתת את 
  */
  const { data: session } = useSession()
  return (
    <>
      <h1 className="text-red-700 text-5xl font-bold bg-yellow-300">{session?.user?.name}</h1>
      <img src={session?.user?.image!} className="w-32 h-32 rounded-full" />
      {
        session ? (
          <button onClick={()=>signOut()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Sign Out</button>
        ) : (
          <button onClick={()=>signIn()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Sign In</button>
        )
      }
    </>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
