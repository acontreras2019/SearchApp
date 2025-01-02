// src/app/models/filter.model.ts

/** Representa una opción dentro de un filtro */
export interface FilterOption {
    id: string; // Identificador único de la opción
    name: string; // Nombre legible de la opción
    selected: boolean; // Indica si la opción está seleccionada
  }
  
  /** Representa un filtro con un conjunto de opciones */
  export interface Filter {
    type: string; // Tipo de filtro (Documentos, Datos Abiertos, etc.)
    id: string; // Identificador único del filtro
    icon: string;
    options: FilterOption[]; // Opciones disponibles para este filtro
  }
  