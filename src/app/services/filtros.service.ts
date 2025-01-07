import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Filter } from '../models/filter.model';  // Asegúrate de importar correctamente el modelo

@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  private apiUrl = 'http://127.0.0.1:5000/api/filtro'; // URL del backend

  // Creamos un BehaviorSubject para almacenar los filtros seleccionados
  private selectedFiltersSubject = new BehaviorSubject<Filter[]>([]);
  selectedFilters$ = this.selectedFiltersSubject.asObservable(); // Observable para que los componentes puedan suscribirse

  constructor(private http: HttpClient) {}

  // Método para obtener los filtros del backend
  getFiltro(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.apiUrl);
  }

  // Método para actualizar los filtros seleccionados
  updateSelectedFilters(filters: Filter[]): void {
    this.selectedFiltersSubject.next(filters); // Emitir los filtros seleccionados
  }

  // Método para obtener los filtros seleccionados (se puede usar si se necesita en algún componente)
  getSelectedFilters(): Filter[] {
    return this.selectedFiltersSubject.getValue();
  }

  
}
