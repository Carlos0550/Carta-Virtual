import { Flex, Title } from "@mantine/core";
import DashboardGadgets from "./components/DashboardGadgets";


function Dashboard() {

  return (
    <Flex direction="column" gap="md">
      <Title order={2}>Dashboard</Title>
      <DashboardGadgets/>
    </Flex>
  );
}

export default Dashboard;
