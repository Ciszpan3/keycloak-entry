import { Component, computed, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'keycloak-entry';
  private keycloakService = inject(KeycloakService)
  private destroyRef = inject(DestroyRef)
  user = computed(() => this.keycloakService.profile)

  // ngOnInit() {
  //   const interval = setInterval(() => this.keycloakService.refresh(), 3000)

  //   this.destroyRef.onDestroy(() => {
  //     clearInterval(interval)
  //   })
  // }
  async logout() {
    console.log('logout')
    await this.keycloakService.logout()
  }
  async refresh() {
    await this.keycloakService.refresh()
  }

  async login() {
    await this.keycloakService.init()
    await this.keycloakService.login()
  }

  // async ngOnOnit() {
  //   await this.keycloakService.init()
  //   await this.keycloakService.login()
  // }
}
