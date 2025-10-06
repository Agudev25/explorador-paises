import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaisService, Pais } from '../../services/pais.service';

@Component({
  selector: 'app-lista-paises',
  templateUrl: './lista-paises.component.html',
  styleUrls: ['./lista-paises.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListaPaisesComponent {
  terminoBusqueda: string = '';
  filtroCapital: string = '';
  filtroRegion: string = '';
  poblacionMin: number | null = null;
  poblacionMax: number | null = null;

  // Estado del juego
  juegoActivo: boolean = false;
  paisSecreto: Pais | null = null;
  opciones: string[] = [];
  respuestaCorrecta: boolean = false;
  respuestaSeleccionada: string | null = null;
  juegoTerminado: boolean = false;
  puntuacion: number = 0;
  intentos: number = 0;

  regionesUnicas: string[] = [];

  constructor(private paisService: PaisService) {
    setTimeout(() => {
      this.regionesUnicas = this.obtenerRegionesUnicas();
    }, 1000);
  }

  paises(): Pais[] {
    return this.paisService.paises();
  }

  obtenerRegionesUnicas(): string[] {
    const regiones = this.paises()
      .map(p => p.region)
      .filter(region => region !== undefined) as string[];
    return [...new Set(regiones)].sort();
  }

  // 🎮 MÉTODOS DEL JUEGO
  iniciarJuego() {
    this.juegoActivo = true;
    this.juegoTerminado = false;
    this.respuestaSeleccionada = null;
    this.respuestaCorrecta = false;
    this.generarPregunta();
  }

  generarPregunta() {
    const paises = this.paises();
    if (paises.length < 4) return;

    // Seleccionar país secreto al azar
    const indiceSecreto = Math.floor(Math.random() * paises.length);
    this.paisSecreto = paises[indiceSecreto];

    // Seleccionar 3 países incorrectos al azar
    const opcionesIncorrectas: string[] = [];
    while (opcionesIncorrectas.length < 3) {
      const indiceAleatorio = Math.floor(Math.random() * paises.length);
      const nombrePais = paises[indiceAleatorio].name.common;
      if (nombrePais !== this.paisSecreto.name.common && 
          !opcionesIncorrectas.includes(nombrePais)) {
        opcionesIncorrectas.push(nombrePais);
      }
    }

    // Combinar y mezclar opciones
    this.opciones = [this.paisSecreto.name.common, ...opcionesIncorrectas];
    this.opciones = this.mezclarArray(this.opciones);
  }

  mezclarArray(array: any[]): any[] {
    const nuevoArray = [...array];
    for (let i = nuevoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
    }
    return nuevoArray;
  }

  seleccionarRespuesta(opcion: string) {
    if (this.juegoTerminado) return;
    
    this.respuestaSeleccionada = opcion;
    this.respuestaCorrecta = opcion === this.paisSecreto?.name.common;
    this.juegoTerminado = true;
    
    if (this.respuestaCorrecta) {
      this.puntuacion++;
    }
    this.intentos++;
  }

  siguientePregunta() {
    this.juegoTerminado = false;
    this.respuestaSeleccionada = null;
    this.generarPregunta();
  }

  terminarJuego() {
    this.juegoActivo = false;
    this.paisSecreto = null;
    this.opciones = [];
    this.respuestaSeleccionada = null;
    this.juegoTerminado = false;
  }

  // 🔍 MÉTODOS DE FILTRADO (los que ya tenías)
  filtrarPaises(): Pais[] {
    let paisesFiltrados = this.paises();

    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.name.common.toLowerCase().includes(termino) ||
        p.name.official.toLowerCase().includes(termino)
      );
    }

    if (this.filtroCapital.trim()) {
      const capital = this.filtroCapital.toLowerCase();
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.capital && p.capital[0]?.toLowerCase().includes(capital)
      );
    }

    if (this.filtroRegion) {
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.region === this.filtroRegion
      );
    }

    if (this.poblacionMin !== null) {
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.population && p.population >= this.poblacionMin!
      );
    }

    if (this.poblacionMax !== null) {
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.population && p.population <= this.poblacionMax!
      );
    }

    return paisesFiltrados;
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroCapital = '';
    this.filtroRegion = '';
    this.poblacionMin = null;
    this.poblacionMax = null;
  }

  getNativeOfficialName(pais: Pais): string {
    if (!pais.name.nativeName) return '—';
    const entries = Object.values(pais.name.nativeName);
    if (entries.length === 0) return '—';
    const firstEntry = entries[0] as any;
    return firstEntry.official || '—';
  }

  getLanguages(pais: Pais): string {
    if (!pais.languages) return '—';
    const languages = Object.values(pais.languages);
    return languages.length > 0 ? languages.join(', ') : '—';
  }
}