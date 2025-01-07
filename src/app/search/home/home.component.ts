import { Component,Input , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otras directivas comunes.
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)].
import { Filter, FilterOption } from '../../models/filter.model'; // Importa las interfaces
import { FiltroService } from '../../services/filtros.service';
import { BusquedaService } from '../../services/busqueda.service';

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
  @Input() selectedFilters: any[] = [];  // Recibe los filtros seleccionados
 


  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private filtroService: FiltroService,
    private busquedaService: BusquedaService
  ) {}

  ngOnInit(): void {
    this.filtroService.selectedFilters$.subscribe(filters => {
      this.selectedFilters = filters;  // Aquí se actualizan los filtros en tiempo real
    console.log(this.selectedFilters)
    });
  }
 

  // Método para realizar la búsqueda
  search() {
    console.log('Buscando:', this.searchQuery);
    this.searchExecuted = true;

    // Recolectamos las categorías seleccionadas para cada tipo de filtro
    const paramsFilter = {
      fuente: this.selectedFilters.find(f => f.type === 'fuente')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      socialNetwork: this.selectedFilters.find(f => f.type === 'socialNetwork')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      time: this.selectedFilters.find(f => f.type === 'time')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
    };
    
    console.log(paramsFilter)

    this.busquedaService.buscarResultados(this.searchQuery, paramsFilter)
      .subscribe(
        (data: any) => {
          console.log(data)
          this.results = data.results; // Asumimos que 'results' contiene los resultados
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
          this.results = []; // Limpia los resultados en caso de error
        }
      );
  }

  analisis() {
    if (this.searchQuery.trim()) {
      this.busquedaService.analisis(this.searchQuery).subscribe(
        (result) => {
          console.log(result)
          this.results = result;
        },
        (error) => {
          console.error('Error analyzing text:', error);
          this.results = [];
        }
      );
    }

    }

}