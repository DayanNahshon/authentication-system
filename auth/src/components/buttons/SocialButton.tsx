import { signIn } from "next-auth/react"
import * as React from "react"
import { FaFacebook, FaGithub, FaGoogle, FaTwitter } from "react-icons/fa"

interface ISocialButtonProps {
    id: string,
    text: string,
    csrfToken: string,
}

const colors: any = {
    google: "#DB4437",
    facebook: "#4285F4",
    github: "#333",
    twitter: "#1DA1F2",
}

const SocialButton: React.FC<ISocialButtonProps> = (props) => {
    const { id, text, csrfToken } = props
    const createIconJsx = () => {
        switch (id) {
        case "google":
            return <FaGoogle />;
        case "facebook":
            return <FaFacebook />;
        case "github":
            return <FaGithub />;
        case "twitter":
            return <FaTwitter />;
        default:
            return
        }
    }

    return (
        <form method="post" action={`/api/auth/signin/${id}`}>
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
            <button
                className="mb-2 py-2 px-8 flex justify-center items-center gap-2 hover:bg-gray-700 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
                type="button"
                onClick={() => signIn(id)}
                style={{ background: `${colors[id]}` }}
            >
                {createIconJsx()}
                {text}
            </button>
        </form>
    )
}

export default SocialButton