import { Flex, Tabs, Text } from '@mantine/core'
import { useState } from 'react';
import { FaRegStar } from 'react-icons/fa';
import { GiMeal } from 'react-icons/gi';
import { IoFastFood } from 'react-icons/io5';

import { TbCategoryFilled } from "react-icons/tb";
import Categories from './components/Categories/Categories';

function MenuConfig() {
    const [activeTab, setActiveTab] = useState<string | null>('categorias');
  return (
    <Flex
        direction={"column"}
        gap={"1rem"}
    >
        <Text
            c={"2c2c2c"}
            size='1.5rem'
            fw={500}
        >Gestión del Menú</Text>
        <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab value="categorias" leftSection={<TbCategoryFilled size={18}/>}>Categorías</Tabs.Tab>
                <Tabs.Tab value="comidas" leftSection={<IoFastFood size={18}/>}>Comidas</Tabs.Tab>
                <Tabs.Tab value="especiales" leftSection={<FaRegStar size={18}/>}>Especiales</Tabs.Tab>
                <Tabs.Tab value="combos" leftSection={<GiMeal size={18}/>}>Combos</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value='categorias'>
                <Categories/>
            </Tabs.Panel>
        </Tabs>
    </Flex>
  )
}

export default MenuConfig