import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 importa esto
import { PaisService, Pais } from '../../services/pais.service';

@Component({
  selector: 'app-lista-paises',
  templateUrl: './lista-paises.component.html',
  styleUrls: ['./lista-paises.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] // 👈 añade aquí
})
export class ListaPaisesComponent {
  terminoBusqueda: string = '';

  constructor(private paisService: PaisService) {}

  paises() {
    return this.paisService.paises();
  }

  filtrarPaises(): Pais[] {
    if (!this.terminoBusqueda.trim()) {
      return this.paises();
    }
    const termino = this.terminoBusqueda.toLowerCase();
    return this.paises().filter(p =>
      p.name.common.toLowerCase().includes(termino) ||
      p.name.official.toLowerCase().includes(termino)
    );
  }

  getNativeOfficialName(pais: Pais): string {
    if (!pais.name.nativeName) return '—';
    const entries = Object.values(pais.name.nativeName);
    if (entries.length === 0) return '—';
    return (entries[0] as any).official;
  }

  getLanguages(pais: Pais): string {
    return pais.languages ? Object.values(pais.languages).join(', ') : '—';
  }
}
