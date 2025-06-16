import { endpoints } from "../../../../../Context/ContextUtils/Apis";

interface Props {
  countrySearch: string;
}

export interface Country {
  value: string;
  label: string;
}

export const GetCountries = async ({ countrySearch }: Props): Promise<{
  msg: string;
  data: Country[];
  err: boolean;
}> => {
  const url = new URL(`${endpoints.geodata}/countries`);
  url.searchParams.append("namePrefix", countrySearch || "");

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
    const data = responseData.countries || [];

    return {
      msg: "Países obtenidos correctamente",
      data,
      err: false,
    };
  } catch (error) {
    console.error("Error al obtener los países:", error);
    return {
      msg: "Ocurrió un error al obtener los países.",
      data: [],
      err: true,
    };
  }
};
