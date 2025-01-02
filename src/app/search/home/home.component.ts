import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otras directivas comunes.
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)].
import { Filter, FilterOption } from '../../models/filter.model'; // Importa las interfaces
import { ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ], // Importa CommonModule y FormsModule.
  templateUrl: './home.component.html',
  standalone: true,  // Indica que este componente es autónomo
})

export class HomeComponent {
  searchQuery: string = ''; // El texto de búsqueda ingresado por el usuario
  searchExecuted: boolean = false; // Indica si se ha ejecutado la búsqueda
  results: any[] = []; // Resultados de la búsqueda
  filtersData: Filter[] = []; // Utiliza la interfaz importada


  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
  }
 

  // Método para realizar la búsqueda
  search() {
    this.searchExecuted = true;

    // Recolectamos las categorías seleccionadas para cada tipo de filtro
    const selectedFilters = {
      documents: this.filtersData.find(f => f.id === 'documents')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      openData: this.filtersData.find(f => f.id === 'openData')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      database: this.filtersData.find(f => f.id === 'database')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || []
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