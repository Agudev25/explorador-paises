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

  // Lista de regiones únicas para el dropdown
  regionesUnicas: string[] = [];

  constructor(private paisService: PaisService) {
    // Cargar regiones únicas cuando el servicio tenga datos
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

  filtrarPaises(): Pais[] {
    let paisesFiltrados = this.paises();

    // Filtro por nombre
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.name.common.toLowerCase().includes(termino) ||
        p.name.official.toLowerCase().includes(termino)
      );
    }

    // Filtro por capital
    if (this.filtroCapital.trim()) {
      const capital = this.filtroCapital.toLowerCase();
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.capital && p.capital[0]?.toLowerCase().includes(capital)
      );
    }

    // Filtro por región
    if (this.filtroRegion) {
      paisesFiltrados = paisesFiltrados.filter(p => 
        p.region === this.filtroRegion
      );
    }

    // Filtro por población
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