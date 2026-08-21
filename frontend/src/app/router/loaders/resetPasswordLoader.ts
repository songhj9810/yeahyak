export const resetPasswordLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")

  if (!token) throw new Response("올바르지 않은 접근입니다", { status: 400 })

  return { token }
}
