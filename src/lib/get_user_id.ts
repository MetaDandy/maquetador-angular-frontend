import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token: string) => {
  try {
    const decoded: any = jwtDecode(token); 
    return decoded.sub; 
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null; 
  }
};