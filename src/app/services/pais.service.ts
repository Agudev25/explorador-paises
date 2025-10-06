import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Pais {
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
  capital?: string[];
  population?: number;
  region?: string;
  flags: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  languages?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  paises = signal<Pais[]>([]);

  constructor(private http: HttpClient) {
    this.cargarPaises();
  }

  private cargarPaises() {
    this.http
      .get<Pais[]>('https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,languages')
      .subscribe({
        next: (data) => {
          console.log('Datos de la API:', data);
          this.paises.set(data);
        },
        error: (err) => console.error('Error cargando países:', err)
      });
  }
}