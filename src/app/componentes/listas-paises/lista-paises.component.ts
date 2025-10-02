import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaisService } from '../../services/pais.service';
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
}
