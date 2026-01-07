// import Image from "next/image";

// export default function Home() {
//   return <></>
// }

import { signIn, auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {
  const session = await auth();
  // const router = useRouter();

  console.log(session);

  return (
    <>
      {session !== null ? (
        <>
          <h1>本当にログアウトしますか</h1>
          <form
            action={async () => {
              "use server";
              // redirectToで強制的に"/login"に遷移させる
              await signOut({redirectTo:"/login"});
            }}
          >
            <button type="submit">はい</button>
          </form>
          <Link href="/home">いいえ</Link>
        </>
      ) : (
        <>
        </>
      )}
    </>
  );
}