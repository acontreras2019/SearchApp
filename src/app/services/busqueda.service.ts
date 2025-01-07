import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { text } from 'node:stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private apiUrl = 'http://127.0.0.1:5000/api/busqueda'; // URL del backend

  constructor(private http: HttpClient) {}

  /**
   * Realiza la búsqueda en el backend.
   * @param searchQuery Texto de búsqueda ingresado por el usuario.
   * @param selectedFilters Filtros seleccionados por el usuario.
   * @returns Un Observable con los resultados de la búsqueda.
   */
  buscarResultados(searchQuery: string, selectedFilters: any): Observable<any> {
    console.log(selectedFilters)
    const params = new HttpParams()
      .set('query', searchQuery)
      .set('fuente', (selectedFilters.fuente || []).join(','))
      .set('socialNetwork', (selectedFilters.socialNetwork || []).join(','))
      .set('time', (selectedFilters.time || []).join(','));

    return this.http.get(this.apiUrl, { params });
  }

  analisis(searchQuery: string): Observable<any> {
    console.log(searchQuery)
    const text:string = searchQuery;
    return this.http.post(this.apiUrl+"/analisis", { text });
  }

}
