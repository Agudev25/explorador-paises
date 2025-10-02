import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pais, PaisService } from '../../services/pais.service';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-lista-paises',
  templateUrl: './lista-paises.component.html',
  styleUrls: ['./lista-paises.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ListaPaisesComponent {
  // Declarar la señal y asignarla en el constructor (evita el "usada antes de inicialización")
  paises: Signal<any[]>;

  constructor(private paisService: PaisService) {
    this.paises = this.paisService.paises;
  }
  getNativeOfficialName(pais: Pais): string {
  if (!pais.name.nativeName) return '—';  // no hay nativeName
  const entries = Object.values(pais.name.nativeName); // convierte a array
  if (entries.length === 0) return '—';
  return entries[0].official; // toma el primer idioma
}
getLanguages(pais: Pais): string {
  if (!pais.languages) return '—';
  return Object.values(pais.languages).join(', ');
}

}
