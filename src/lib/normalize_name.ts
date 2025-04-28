export const normalizeName = (name: string) => {
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize("NFD") // Normalizar caracteres especiales (acentos y ñ)
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos y marcas diacríticas
    .replace(/[^a-z0-9_]/g, "_") // Reemplazar caracteres no alfanuméricos por guiones bajos
    .replace(/_+/g, "_") // Reemplazar múltiples guiones bajos por un solo guion bajo
    .replace(/^_+|_+$/g, ""); // Eliminar guiones bajos al inicio o al final
};