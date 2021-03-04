const API_SERVER_PROTOCOL = 'http'
const API_SERVER_HOST = '218.147.138.41'
const API_SERVER_PORT = 20000

export function api(subPath: string) {
    return `${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}${subPath.startsWith("/") ? subPath : "/" + subPath}`
}