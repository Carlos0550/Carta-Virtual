import { Tabs, Text } from '@mantine/core';

function QRPage() {
  return (
    <Tabs defaultValue="menu">
      <Tabs.List>
        <Tabs.Tab value="menu">QR de mi Carta</Tabs.Tab>
        <Tabs.Tab value="wifi">QR de mi WiFi</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="menu">
        <Text p="md" size="sm">Contenido del QR de la carta</Text>
      </Tabs.Panel>
      <Tabs.Panel value="wifi">
        <Text p="md" size="sm">Contenido del QR de WiFi</Text>
      </Tabs.Panel>
    </Tabs>
  );
}

export default QRPage;
