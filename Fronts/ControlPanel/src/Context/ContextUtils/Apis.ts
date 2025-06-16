export const base_api={
    url: import.meta.env.VITE_SERVER_URL === "production"
    ? ""
    : "http://localhost:5001"
}

export const endpoints = {
    users: new URL(`${base_api.url}/users`),
    auth: new URL(`${base_api.url}/auth`),
    geodata: new URL(`${base_api.url}/geodata`),
    business: new URL(`${base_api.url}/business`),
}