import { Button, TextInput, Stack, PinInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useState } from "react"
import { useAppContext } from "../../Context/AppContext"

function LoginForm() {
  const {
    useAuthHook: {
      loginUser,
      validateOTP
    }
  } = useAppContext()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const form = useForm({
    initialValues: {
      user_email: '',
    },
  })

  const handleEmailSubmit = async ({ user_email }: { user_email: string }) => {
    setLoading(true)
    setEmail(user_email)

    const result = await loginUser(user_email)
    setLoading(false)
    if(result){
      setStep("otp")
    }
  }

  const handleOtpSubmit = async() => {
    setLoading(true)
    await validateOTP(form.values.user_email, otp)
    setLoading(false)
    setOtp("")
  }

  return (
    <form
      onSubmit={form.onSubmit(step === "email" ? handleEmailSubmit : handleOtpSubmit)}
      style={{ width: "100%" }}
    >
      <Stack>
        {step === "email" && (
          <TextInput
            label="Email"
            placeholder="correo@example.com"
            required
            disabled={loading}
            {...form.getInputProps('user_email')}
          />
        )}

        {step === "otp" && (
          <PinInput
            length={6}
            value={otp}
            onChange={setOtp}
            oneTimeCode
            type="number"
            inputMode="numeric"
            autoFocus
          />
        )}

        <Button type="submit" fullWidth mt="sm" loading={loading}>
          {step === "email" ? "Continuar" : "Validar código"}
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
