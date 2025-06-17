import "./css/Sidebar.css"
import { IoMenu, IoHome, IoLogOutOutline } from "react-icons/io5";
import { type SetStateAction } from "react";
import { Flex, Box, Text, Button, Card } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import { useAppContext } from "../Context/AppContext";
import { BiDish, BiFoodMenu, BiQr } from "react-icons/bi";

interface Props {
    mobileExtended: boolean,
    setMobileExtended: React.Dispatch<SetStateAction<boolean>>
}
function Sidebar({ mobileExtended, setMobileExtended }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        width,
        useAuthHook:{
            clearSessionData,
            loginData
        }
    } = useAppContext();

    const cutEmail = (email: string, maxLenght:number = 20) => {
        if(!email) return ""
        return email.slice(0,maxLenght) + "..."
    }

    return (
        <Box className='sidebar-container' >
            {width > 768 ? (
                <Flex direction="column" justify={"space-between"} className='sidebar' w={"100%"} mih={"95vh"} h={"100%"}>
                    <Box

                    >
                        <Flex
                            align={"center"}
                            justify={"center"}
                            
                        >
                            <Text className='sidebar-logo' size={"1.5rem"} fw={700}>GastroLink</Text>
                            <picture className="sidebar-logo-img">
                                <img src="https://duszvzmtpoxsyxyibtuq.supabase.co/storage/v1/object/public/images/c4905ba5-4363-4c55-9282-f19977d56240.png" />
                            </picture>
                        </Flex>

                        <Box className="sidebar-divider" />

                        <Flex
                            direction={"column"}
                            gap={10}
                        >
                            <Box
                            className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
                            onClick={() => navigate("/")}

                        >
                            <IoHome size={20} /> Inicio
                        </Box>

                        <Box
                            className={`sidebar-list ${location.pathname === "/business" ? "active" : ""}`}
                            onClick={() => navigate("/business")}
                        >
                            <FaBriefcase size={20} /> Mi negocio
                        </Box>

                        <Box
                            className={`sidebar-list ${location.pathname === "/menu-configuration" ? "active" : ""}`}
                            onClick={() => navigate("/menu-configuration")}
                        >
                            <BiDish size={20} /> Mi menú
                        </Box>

                        <Box
                            className={`sidebar-list disabled ${location.pathname === "/expirations" ? "active" : ""}`}
                            // onClick={() => navigate("/expirations")}
                        >
                            <BiFoodMenu size={20} /> Personalización de carta
                        </Box>

                        <Box
                            className={`sidebar-list disabled ${location.pathname === "/monthly-resume" ? "active" : ""}`}
                            // onClick={() => navigate("/monthly-resume")}
                        >
                            <BiQr size={20} /> Mi QR
                        </Box>
                        </Flex>

                        <Box className="sidebar-divider" />
                    </Box>

                    <Card shadow="md">
                        <Flex align="center" direction={"column"} justify="space-between">
                            <Flex w={"100%"} align="center" gap="sm">
                                <Box>
                                    <img
                                        src="https://ui-avatars.com/api/?name=Carlos+Pelinski&background=0D8ABC&color=fff"
                                        alt="Perfil"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Text fw={600} size="sm">{loginData.isAuth && loginData.user_info.user_name}</Text>
                                    <Text size="xs" c="dimmed">{loginData.isAuth && cutEmail(loginData.user_info.user_email)}</Text>
                                </Box>
                            </Flex>

                            <Button
                                variant="light"
                                color="red"
                                size="xs"
                                onClick={() => {
                                    clearSessionData()
                                }}
                                leftSection={<IoLogOutOutline size={18} />}
                            >Cerrar sesión </Button>
                            
                        </Flex>
                    </Card>

                </Flex>
            ) : (
                <Box  className={`sidebar-mobile ${mobileExtended ? "extended" : ""}`}>
                    <Flex
                        align={"center"}
                        justify={"center"}
                        
                        h={"35px"}
                    >
                        <Text className='sidebar-logo' size="xs" fw={700}>GastroLink</Text>
                        <picture className="sidebar-logo-img">
                            <img src="https://duszvzmtpoxsyxyibtuq.supabase.co/storage/v1/object/public/images//c4905ba5-4363-4c55-9282-f19977d56240.png" />
                        </picture>
                    </Flex>

                    <Flex  align="center" justify="space-between" w={"100%"}  px="sm" mt={5}>
                        <Box className="sidebar-menu-icon" onClick={() => setMobileExtended(!mobileExtended)}>
                            <IoMenu size={20} />
                        </Box>
                    </Flex>

                    <Flex direction="column" w={"100%"}  className='sidebar-mobile-list'>
                        {width <= 768 && (
                            <>
                            <Card w={"100%"} h={"min-content"}>
                        <Flex align="center"  w={"100%"} justify="space-between">
                            <Flex w={"100%"} align="center" gap="sm">
                                <Box>
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${loginData.isAuth && loginData.user_info.user_name || ""}&background=0D8ABC&color=fff`}
                                        alt="Perfil"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>

                                 <Box>
                                    <Text fw={600} size="sm">{loginData.isAuth && loginData.user_info.user_name}</Text>
                                    <Text size="xs" c="dimmed">{loginData.isAuth && cutEmail(loginData.user_info.user_email)}</Text>
                                </Box>
                            </Flex>

                            <Button
                                variant="light"
                                color="red"
                                size="xs"
                                miw={"130px"}
                                onClick={() => {
                                    clearSessionData()
                                }}
                                leftSection={<IoLogOutOutline size={18} />}
                            >Cerrar sesión </Button>
                            
                        </Flex>
                    </Card>
                                <Box
                                    className={`sidebar-list ${location.pathname === "/" ? "active" : ""}`}
                                    onClick={() => {
                                        navigate("/");
                                        setMobileExtended(false);
                                    }}
                                >
                                    <IoHome size={20} /> Inicio
                                </Box>

                                <Box
                                    className={`sidebar-list ${location.pathname === "/business" ? "active" : ""}`}
                                    onClick={() => {
                                        navigate("/business");
                                        setMobileExtended(false);
                                    }}
                                >
                                    <FaBriefcase size={20} /> Mi negocio
                                </Box>

                                <Box
                                    className={`sidebar-list ${location.pathname === "/expirations" ? "active" : ""}`}
                                    onClick={() => {
                                        navigate("/menu-configuration")
                                    }}
                                >
                                    <BiDish size={20} /> Mi menú
                                </Box>

                                <Box
                                    className={`sidebar-list disabled ${location.pathname === "/expirations" ? "active" : ""}`}
                                    onClick={() => {
                                        // navigate("/expirations")
                                        setMobileExtended(false);
                                    }}
                                >
                                    <BiFoodMenu size={20} /> Personalización de carta
                                </Box>

                                <Box
                                    className={`sidebar-list disabled ${location.pathname === "/monthly-resume" ? "active" : ""}`}
                                    // onClick={() => navigate("/monthly-resume")}
                                >
                                    <BiQr size={20} /> Mi QR
                                </Box>

                            </>
                        )}

                    </Flex>
                </Box>
            )}
            
        </Box>
    );
}

export default Sidebar;