import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormField, MatToolbar, MatIconButton, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'app-header',
  },
})
export class HeaderComponent {
  readonly cantidadCarrito = input(0);
  readonly buscar = output<string>();
  readonly abrirCarrito = output<void>();
  readonly abrirCuenta = output<void>();

  private readonly injector = inject(Injector);
  private readonly campoBusqueda =
    viewChild.required<ElementRef<HTMLInputElement>>('campoBusqueda');
  private readonly botonBusqueda = viewChild.required<MatIconButton, ElementRef<HTMLButtonElement>>(
    'botonBusqueda',
    { read: ElementRef },
  );

  private readonly busqueda = signal({ termino: '' });
  protected readonly formularioBusqueda = form(this.busqueda);
  protected readonly busquedaAbierta = signal(false);
  protected readonly etiquetaCarrito = computed(() => {
    const cantidad = this.cantidadCarrito();
    return `Carrito, ${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`;
  });

  mostrarBusqueda(): void {
    this.busquedaAbierta.set(true);
    afterNextRender(() => this.campoBusqueda().nativeElement.focus(), { injector: this.injector });
  }

  cerrarBusqueda(): void {
    if (!this.busquedaAbierta()) {
      return;
    }
    this.busquedaAbierta.set(false);
    this.botonBusqueda().nativeElement.focus();
  }

  enviarBusqueda(evento: Event): void {
    evento.preventDefault();
    const termino = this.busqueda().termino.trim();
    if (!termino) {
      return;
    }
    this.buscar.emit(termino);
    this.busquedaAbierta.set(false);
  }
}
