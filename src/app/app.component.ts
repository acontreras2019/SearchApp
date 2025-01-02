
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Filter, FilterOption } from './models/filter.model';
import { FiltroService } from './filtros.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corregido a "styleUrls"
})
export class AppComponent {
  title = 'SearchApp';
  isSidebarOpen = false;
  searchQuery: string = ''; // El texto de búsqueda ingresado por el usuario
  searchExecuted: boolean = false; // Indica si se ha ejecutado la búsqueda
  results: any[] = []; // Resultados de la búsqueda
  // isFiltersHidden: boolean = true;  // Estado para mostrar/ocultar filtros
  filtersData: Filter[] = []; // Utiliza la interfaz importada
  
    constructor(
      private filtroService: FiltroService,
      private cdr: ChangeDetectorRef
    ) {}

   ngOnInit(): void {
      this.filtroService.getFiltro().subscribe(
        (data: Filter[]) => {
          this.filtersData = data;
          this.cdr.detectChanges(); // Forzar la detección de cambios
        },
        (error) => {
          console.error('Error al cargar el menú:', error);
        }
      );
    }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
   
}
