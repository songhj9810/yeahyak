import { useMutation } from "@tanstack/react-query"

import { sendPasswordResetMail } from "../api/sendPasswordResetMail"

export const useSendPasswordResetMail = () => {
  return useMutation({
    mutationFn: sendPasswordResetMail,
  })
}
