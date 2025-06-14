import { Box, Flex, Text, Title, Button, Group, Paper } from "@mantine/core"
import { useState } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

function Auth() {
    const [isLogin, setIsLogin] = useState(true)

    return (
        <Flex justify="center" align="center" h="100vh" bg="gray.0">
            <Paper shadow="lg" radius="lg" p="xl" withBorder w={380}>
                <Flex direction="column" align="center" gap="md">
                    <Title order={2} ta="center">
                        Bienvenido a{" "}
                        <Text
                            span
                            size="1.5rem"
                            fw={700}
                            variant="gradient"
                            gradient={{ from: "blue.9", to: "pink.4", deg: 45 }}
                        >
                            GastroLink
                        </Text>
                    </Title>


                    <Text size="sm" c="dimmed" ta="center">
                        {isLogin
                            ? "Iniciá sesión para acceder a tu carta"
                            : "Crea una cuenta para empezar a usar tu carta virtual"}
                    </Text>

                    {isLogin ? <LoginForm /> : <RegisterForm />}

                    <Group mt="md">
                        <Text size="sm">
                            {isLogin ? "¿No tenés una cuenta?" : "¿Ya tenés cuenta?"}
                        </Text>
                        <Button variant="subtle" size="xs" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Registrarse" : "Iniciar sesión"}
                        </Button>
                    </Group>
                </Flex>
            </Paper>
        </Flex>
    )
}

export default Auth
