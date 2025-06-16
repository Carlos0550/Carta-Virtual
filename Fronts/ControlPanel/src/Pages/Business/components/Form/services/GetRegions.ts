import { endpoints } from "../../../../../Context/ContextUtils/Apis";

interface Props {
  countryCode: string;
  regionSearch: string; // por compatibilidad, aunque no se use
}

export interface Region {
  value: string;
  label: string;
}

export const GetRegions = async ({ countryCode }: Props): Promise<{
  msg: string;
  regions: Region[];
  err: boolean;
}> => {
  if (!countryCode) {
    return { msg: "Código de país no proporcionado", regions: [], err: true };
  }

  const url = new URL(`${endpoints.geodata}/regions`);
  url.searchParams.append("country_iso", countryCode);

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
    const regions = responseData.regions || [];

    return {
      msg: "Regiones obtenidas correctamente",
      regions,
      err: false,
    };
  } catch (error) {
    console.error("Error al obtener las regiones:", error);
    return {
      msg: "Ocurrió un error al obtener las regiones.",
      regions: [],
      err: true,
    };
  }
};
