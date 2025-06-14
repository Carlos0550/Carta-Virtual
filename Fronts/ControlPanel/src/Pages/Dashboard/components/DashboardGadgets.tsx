import React from 'react'
import {
    Flex,
    Title,
    Card,
    Text,
    Grid,
    Box,
    Group,
    ActionIcon,
    Tooltip,
    Divider,
    Badge,
    Image,
    useMantineTheme,
    Paper,
} from "@mantine/core";
import { IconEye, IconDownload, IconCopy, IconChefHat, IconChartBar } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";


function DashboardGadgets() {
    const visitsData = [
        // { name: "Lun", views: 120 },
        // { name: "Mar", views: 210 },
        // { name: "Mié", views: 150 },
        // { name: "Jue", views: 300 },
        // { name: "Vie", views: 250 },
        // { name: "Sáb", views: 500 },
        // { name: "Dom", views: 320 },
    ];

    const sectionStats = [
        // { section: "Bebidas", views: 420 },
        // { section: "Postres", views: 380 },
        // { section: "Platos principales", views: 560 },
        // { section: "Promos", views: 190 },
    ];
    const theme = useMantineTheme();

    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                        <Text fw={500}>Visitas en los últimos 7 días</Text>
                        <IconChartBar size={20} />
                    </Group>
                    <Divider my="sm" />
                    <Box h={200}>
                        <ResponsiveContainer width="100%" height="100%">
                            {visitsData && visitsData.length > 0 ? (
                                <BarChart data={visitsData}>
                                    <XAxis dataKey="name" stroke={theme.colors.gray[6]} />
                                    <YAxis stroke={theme.colors.gray[6]} />
                                    <RechartTooltip />
                                    <Bar dataKey="views" fill={theme.colors.blue[6]} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            ) : (
                                <Text
                                    fw={500}
                                    c='#464646'
                                    size='lg'
                                >
                                    Aún no hay analíticas de tu negocio
                                </Text>
                            )}
                        </ResponsiveContainer>
                    </Box>
                </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mb="sm">
                        <Text fw={500}>Secciones más consultadas</Text>
                        <IconEye size={20} />
                    </Group>
                    <Divider my="sm" />
                    <Flex direction="column" gap="xs">
                        {sectionStats && sectionStats.length > 0 ? (
                            sectionStats.map((s) => (
                                <Group justify="space-between" key={s.section}>
                                    <Text>{s.section}</Text>
                                    <Badge variant="light" color="blue">{s.views} visitas</Badge>
                                </Group>
                            ))
                        ) : (
                            <Text
                                fw={500}
                                c='#464646'
                                size='lg'
                            >
                                Aún no hay analíticas de tu negocio
                            </Text>
                        )}
                    </Flex>
                </Card>

            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between">
                        <Text fw={500}>Platos cargados</Text>
                        <IconChefHat size={20} />
                    </Group>
                    {/* <Text size="xl" fw={700} mt="md">34</Text>
                    <Text size="sm" c="dimmed">Total actualmente activos</Text> */}
                    <Text
                        fw={500}
                        c='#464646'
                        size='md'
                    >
                        Aún no hay analíticas de tu negocio
                    </Text>
                </Card>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between">
                        <Text fw={500}>Compartir WIFI de mi restaurante</Text>
                        <Group>
                            <Tooltip label="Copiar enlace">
                                <ActionIcon disabled variant="light" color="blue">
                                    <IconCopy size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Descargar QR">
                                <ActionIcon disabled variant="light" color="blue">
                                    <IconDownload size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                    <Divider my="sm" />
                    {/* <Image
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://alpaso.gastrolink.com"
                        alt="QR Code"
                        w={150}
                        mx="auto"
                    />
                    <Text mt="sm" size="sm" c="dimmed">
                        Al-paso-WIFI
                    </Text> */}
                    <Text
                        fw={500}
                        c='#464646'
                        size='md'
                    >
                        Negocio no configurado.
                    </Text>
                </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between">
                        <Text fw={500}>Compartir carta</Text>
                        <Group>
                            <Tooltip label="Copiar enlace">
                                <ActionIcon disabled variant="light" color="blue">
                                    <IconCopy size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Descargar QR">
                                <ActionIcon disabled variant="light" color="blue">
                                    <IconDownload size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                    <Divider my="sm" />
                    {/* <Image
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://alpaso.gastrolink.com"
                        alt="QR Code"
                        w={150}
                        mx="auto"
                    />
                    <Text mt="sm" size="sm" c="dimmed">
                        https://alpaso.gastrolink.com
                    </Text> */}
                    <Text
                        fw={500}
                        c='#464646'
                        size='md'
                    >
                        Negocio no configurado.
                    </Text>
                </Card>

            </Grid.Col>
        </Grid>
    )
}

export default DashboardGadgets