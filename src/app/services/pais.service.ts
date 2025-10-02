import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { effect } from '@angular/core';

export interface Pais {
  languages: any;
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  capital: string[];
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  region: string;
}



@Injectable({
  providedIn: 'root'
})
export class PaisService {
  // Signal que contendrá la lista de países
  paises = signal<Pais[]>([]);

  constructor(private http: HttpClient) {
    this.cargarPaises();
  }
cargarPaises() {
  this.http
    .get<any[]>('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,languages')
    .subscribe({
      next: (data) => {
        console.log('Datos de la API:', data); // 👈 aquí logeamos
        this.paises.set(data);
      },
      error: (err) => console.error('Error cargando países:', err)
    });
}

}
