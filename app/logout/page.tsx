// import Image from "next/image";

// export default function Home() {
//   return <></>
// }

import { signIn, auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"

export default async function Home() {
  const session = await auth();
  // const router = useRouter();

  console.log(session);

  return (
    <>
      {session !== null ? (
        <div className="flex  justify-center items-center place-content-center  min-h-screen">
          <Terminal>
            <TypingAnimation>&gt; Are you really LogOut?</TypingAnimation>
            <AnimatedSpan className="text-green-500">
              <form
                action={async () => {
                  "use server";
                  // redirectToで強制的に"/login"に遷移させる
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <span>
                  <button>
                    ✔ Yes LogOut.
                  </button>
                </span>
              </form>
            </AnimatedSpan>
            <AnimatedSpan className="text-blue-500">
              <span>
                <Link href="/home">
                  ! Don't LogOut
                </Link>
              </span>
            </AnimatedSpan>
          </Terminal>
        </div>
      ) : (
        <>
        </>
      )
      }
    </>
  );
}