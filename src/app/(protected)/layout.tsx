import { auth } from "@/auth"
import { AuthScreen } from "@/feautres/auth/components/auth-screen"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <>
      {session ? (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          {children}
        </>
      ) : (
        <AuthScreen />
      )}
    </>
  )
}
