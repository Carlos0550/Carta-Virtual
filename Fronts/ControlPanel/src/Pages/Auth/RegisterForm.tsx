import { Button, TextInput, Stack, PinInput, InputWrapper, Notification, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useEffect, useRef, useState } from "react"
import { useAppContext } from "../../Context/AppContext"
import { showNotification } from "@mantine/notifications"
import { endpoints } from "../../Context/ContextUtils/Apis"
import { useNavigate } from "react-router-dom"

function RegisterForm() {
  const {
    useAuthHook: { registerUser, validateRegisterOtp }
  } = useAppContext()
  const navigate = useNavigate()

  const [step, setStep] = useState<"form" | "otp" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")

  const [formData, setFormData] = useState({ user_name: "", user_email: "", opt_code: "" })

  const form = useForm({
    initialValues: {
      user_name: '',
      user_email: ''
    }
  })

  const handleFormSubmit = async (values: typeof form.values) => {
    setLoading(true)
    const { err, msg } = await registerUser(values)
    setLoading(false)

    if (!err) {
      setFormData(values as any)
      setStep("otp")
    } else {
      showNotification({
        title: "Error al crear el usuario.",
        message: msg,
        autoClose: 3000,
        position: "top-right",
        color: "yellow"
      })
    }
  }

  const handleOtpSubmit = async () => {
    setLoading(true)
    const success = await validateRegisterOtp({ ...formData, otp_code: otp })
    setLoading(false)

    if (success) {
      showNotification({
        title: "Gracias por unirte a GastroLink",
        message: "Registro completado correctamente.",
        color: "green"
      })
      localStorage.removeItem("restored_user")
      setTimeout(() => {
        setStep("form")
        navigate("/dashboard")
      }, 1500);
    } else {
      showNotification({
        title: "Código inválido",
        message: "Por favor, intentá nuevamente.",
        color: "red"
      })
    }
  }

  const handleRestartOTPCode = async (user_name: string, user_email: string) => {
    try {
      const res = await fetch(`${endpoints.users}/restart-validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name, user_email })
      })
      if (!res.ok) throw new Error("Error al reenviar el código.")
    } catch (error) {
      console.error(error)
      showNotification({
        title: "Error",
        message: "No se pudo reenviar el código. Volvé a intentarlo.",
        color: "red"
      })
      setStep("form")
    }
  }

  const alreadyRestored = useRef(false)
  useEffect(() => {
    if (!alreadyRestored.current) {
      alreadyRestored.current = true
      const restored_user = localStorage.getItem("restored_user")
      if (restored_user) {
        const parsed = JSON.parse(restored_user)
        setFormData(parsed)
        setStep("otp")
        handleRestartOTPCode(parsed.user_name, parsed.user_email)
      }
    }
  }, [])

  return (
    <form
      style={{
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
        
      }}
      onSubmit={form.onSubmit(step === "form" ? handleFormSubmit : handleOtpSubmit)}
    >
      <Stack>
        {step === "form" && (
          <>
            <InputWrapper label="Nombre de usuario" required mb="sm">
              <TextInput placeholder="Juan Pérez" {...form.getInputProps("user_name")} />
            </InputWrapper>

            <InputWrapper label="Email" required mb="sm">
              <TextInput placeholder="correo@example.com" {...form.getInputProps("user_email")} />
            </InputWrapper>
          </>
        )}

        {step === "otp" && (
          <>
            <p>Enviamos un código de verificación a <strong>{formData.user_email}</strong></p>
            <InputWrapper
              title="Ingresá el código de validación"
              description="Lo encontrarás en tu correo."
              required
            >
              <PinInput
                length={6}
                value={otp}
                onChange={setOtp}
                oneTimeCode
                type="number"
                inputMode="numeric"
                autoFocus
              />
            </InputWrapper>
          </>
        )}

        {step === "success" && (
          <Notification
            title={`Muchas gracias por unirte a GastroLink, ${form.values.user_name}`}
            withCloseButton={false}
            color="green"
            __size="lg"
          >
            <Text
              c="#2c2c2c"
              size="xs"
            >
              Espera unos segundos por favor...
            </Text>
          </Notification>
        )}

        <Button type="submit" fullWidth mt="sm" loading={loading} disabled={loading || step === "success"}>
          {step === "form" ? "Continuar" : "Completar registro"}
        </Button>
      </Stack>
    </form>
  )
}

export default RegisterForm
