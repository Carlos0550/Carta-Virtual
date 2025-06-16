import { endpoints } from "../../../../../Context/ContextUtils/Apis";

interface Props {
  countryCode: string;
  regionCode: string;
}

export interface City {
  value: string;
  label: string;
}

export const GetCities = async ({ countryCode, regionCode }: Props): Promise<{
  msg: string;
  cities: City[];
  err: boolean;
}> => {
  if (!countryCode || !regionCode) {
    return {
      msg: "Faltan códigos de país o región.",
      cities: [],
      err: true,
    };
  }

  const url = new URL(`${endpoints.geodata}/cities`);
  url.searchParams.append("country_iso", countryCode);
  url.searchParams.append("region_id", regionCode);

  try {
    const access_token = localStorage.getItem("access_token");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error("La respuesta de la red no fue exitosa.");
    }

    const responseData = await res.json();
    const cities = responseData.cities || [];

    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      msg: "Ciudades obtenidas correctamente",
      cities,
      err: false,
    };
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
    return {
      msg: "Ocurrió un error al obtener las ciudades.",
      cities: [],
      err: true,
    };
  }
};
