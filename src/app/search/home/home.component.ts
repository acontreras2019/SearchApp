import { Component,Input , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otras directivas comunes.
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para [(ngModel)].
// service
import { FiltroService } from '../../services/filtros.service';
import { BusquedaService } from '../../services/busqueda.service';

//models
import { Filter, FilterOption } from '../../models/filter.model'; // Importa las interfaces
import { SentimentData } from '../../models/sentimentData.model'; // Importa las interfaces

import { ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


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
    MatCheckboxModule,
    MatTableModule,
    MatSortModule
  ], // Importa CommonModule y FormsModule.
  templateUrl: './home.component.html',
  standalone: true,  // Indica que este componente es autónomo
})

export class HomeComponent {

  displayedColumns: string[] = ['platform', 'year', 'compound', 'neg', 'neu', 'pos', 'mental_health_label', 'mental_health_score', 'text'];
  searchQuery: string = ''; // El texto de búsqueda ingresado por el usuario
  searchExecuted: boolean = false; // Indica si se ha ejecutado la búsqueda
  results: any[] = []; // Resultados de la búsqueda
  dataSource: SentimentData[] = [];
  statistics: { [key: string]: number } = {};
  loading: boolean = false;
  error: string | null = null;
  
  @Input() selectedFilters: any[] = [];  // Recibe los filtros seleccionados
 
  filters: {
    fuente: string[];
    socialNetwork: string[];
    time: string[];
  } = {
    fuente: [],
    socialNetwork: [],
    time: []
  };
  query: string = '';

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
    this.loading = true;

    // Recolectamos las categorías seleccionadas para cada tipo de filtro
    const paramsFilter = {
      fuente: this.selectedFilters.find(f => f.type === 'fuente')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      socialNetwork: this.selectedFilters.find(f => f.type === 'socialNetwork')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
      time: this.selectedFilters.find(f => f.type === 'time')?.options.filter((o: FilterOption) => o.selected).map((o: FilterOption) => o.id) || [],
    };
    
    console.log(paramsFilter)

    this.busquedaService.buscarResultados(this.searchQuery, paramsFilter)
    .subscribe({
      next: (response) => {

        if (response.filters) {
          this.filters = response.filters;
        }
        if (response.query) {
          this.query = response.query.split(' ').join(', '); // cada palabra la separamos por coma
        }
        this.dataSource = this.parseData(response); // pasar los datos a una estructura manejable en angular
        this.calculateStatistics(); // generar estadistica de la informacion
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener los datos del backend.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  parseData(data: any): SentimentData[] {

    return data.results[0].map((item: any) => ({
      platform: item.platform,
      text: item.text.trim(),
      year: item.year,
      sentiment: item.sentiment,
      mental_health: item.mental_health
    }));
  }

  calculateStatistics(): void {
    const total = this.dataSource.length;
    if (total === 0) {
      this.statistics = {
        totalRegFiltrados: 0,
        totalEntries: 0,
        averageCompound: 0,
        averageMentalHealthScore: 0
      };
      return;
    }

    const totalCompound = this.dataSource.reduce((sum, item) => sum + item.sentiment.compound, 0);
    const averageCompound = totalCompound / total;
    const totalMentalHealthScore = this.dataSource.reduce(
      (sum, item) => sum + (item.mental_health[0]?.score || 0),
      0
    );

  
    this.statistics = {
      totalEntries: total,
      averageCompound: averageCompound,
      averageMentalHealthScore: totalMentalHealthScore / total

    };
  }

 

}

