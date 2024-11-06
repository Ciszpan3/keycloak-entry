import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak = signal<Keycloak | undefined>(undefined);
  private _profile = signal<UserProfile | undefined>(undefined);

  get keycloak() {
    if (!this._keycloak()) {
      this._keycloak.set(
        new Keycloak({
          url: 'http://localhost:8080',
          realm: 'TEST',
          clientId: 'public-client',
        })
      );
    }
    return this._keycloak();
  }

  profile = this._profile.asReadonly()

  constructor() {}

  async init() {
    console.log('keycloak');
    const authenticated = await this.keycloak?.init({
      onLoad: 'login-required',
    });

    console.log(authenticated);
    
    if (authenticated) {
      this._profile.set(
        (await this.keycloak?.loadUserProfile()) as UserProfile
      );
      this._profile()!.token = this.keycloak?.token;
      this._profile()!.refreshToken = this.keycloak?.refreshToken;
      console.log(this.keycloak);
      console.log(this._profile());
    }
  }

  login() {
    return this.keycloak?.login();
  }

  logout() {
    return this.keycloak?.logout({ redirectUri: 'http://localhost:4200' });
  }

  async refresh(): Promise<boolean> {
    try {
      if (this.keycloak) {
        const refreshed = await this.keycloak.updateToken(300);
        if (refreshed) {
          console.log('Token was successfully refreshed.');
          this._profile.set(
            (await this.keycloak?.loadUserProfile()) as UserProfile
          );
          this._profile()!.token = this.keycloak?.token;
          this._profile()!.refreshToken = this.keycloak?.refreshToken;
        } else {
          console.log('Token is still valid.');
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.logout();
    }
    return false;
  }
}
