import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otras directivas comunes.
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)].

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule], // Importa CommonModule y FormsModule.
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,  // Indica que este componente es autónomo
})

export class HomeComponent {
  searchQuery: string = ''; // El texto de búsqueda ingresado por el usuario
  searchExecuted: boolean = false; // Indica si se ha ejecutado la búsqueda
  results: any[] = []; // Resultados de la búsqueda
  isFiltersHidden: boolean = false;  // Estado para mostrar/ocultar filtros

 // Estructura del JSON con los filtros
 filtersData = [
  {
    type: 'Documentos',
    id: 'documents',
    options: [
      { id: 'categoria1', name: 'Categoría 1', selected: false },
      { id: 'categoria2', name: 'Categoría 2', selected: false },
      { id: 'categoria3', name: 'Categoría 3', selected: false }
    ]
  },
  {
    type: 'Datos Abiertos',
    id: 'openData',
    options: [
      { id: 'pagina1', name: 'Página 1', selected: false },
      { id: 'pagina2', name: 'Página 2', selected: false },
      { id: 'pagina3', name: 'Página 3', selected: false }
    ]
  },
  {
    type: 'Base de Datos',
    id: 'database',
    options: [
      { id: 'bd1', name: 'Base de Datos 1', selected: false },
      { id: 'bd2', name: 'Base de Datos 2', selected: false },
      { id: 'bd3', name: 'Base de Datos 3', selected: false }
    ]
  }
];

  constructor(private http: HttpClient) {}

  // Lógica para ocultar/mostrar la barra lateral de filtros
  toggleFilters() {
    this.isFiltersHidden = !this.isFiltersHidden;
  }

  // Método para realizar la búsqueda
  search() {
    this.searchExecuted = true;

    // Recolectamos las categorías seleccionadas para cada tipo de filtro
    const selectedFilters = {
      documents: this.filtersData.find(f => f.id === 'documents')?.options.filter(o => o.selected).map(o => o.id) || [],
      openData: this.filtersData.find(f => f.id === 'openData')?.options.filter(o => o.selected).map(o => o.id) || [],
      database: this.filtersData.find(f => f.id === 'database')?.options.filter(o => o.selected).map(o => o.id) || []
    };

     // Realiza la solicitud HTTP para buscar los resultados con los filtros seleccionados
    this.http.get('https://api.tu-backend.com/busqueda', {
      params: {
        query: this.searchQuery,
        documents: selectedFilters.documents.join(','),
        openData: selectedFilters.openData.join(','),
        database: selectedFilters.database.join(',')
      }
    }).subscribe(
      (data: any) => {
        // Asume que la respuesta contiene un campo 'results' con los resultados de la búsqueda
        this.results = data.results;
      },
      (error) => {
        console.error('Error en la búsqueda:', error);
        this.results = []; // Limpia los resultados en caso de error
      }
    );
  }
}