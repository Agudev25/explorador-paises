import { Component } from '@angular/core';
import { ListaPaisesComponent } from './componentes/listas-paises/lista-paises.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [ListaPaisesComponent] // <-- Importamos el componente standalone aquí
})
export class AppComponent {
  title = 'explorador-paises';
}
