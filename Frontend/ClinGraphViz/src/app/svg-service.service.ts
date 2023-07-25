import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GraphData, GraphRequest } from './types/graph_request';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class SvgServiceService {

  constructor(
    private http: HttpClient) { }

    private backend_URI = "http://localhost:8000"

    post(graphRequest:GraphRequest): Observable<GraphData>{
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const options = { headers }
      const resp = this.http.post<GraphData>(this.backend_URI+"/clingviz/",graphRequest,{...headers})
      
      .pipe(
        catchError((error,caught) => {
          // Handle the error here (e.g., log it or throw a custom error)
          console.error('Error occurred during the HTTP request:', error);
          return of(error)
        })
      );
      return resp; 
    } 
}
