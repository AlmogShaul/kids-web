import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import {userInfo} from "os";

@Injectable()
export class AuthService {

  userProfile: any;
  requestedScopes: string = 'openid profile read:messages write:messages';
  auth0 = new auth0.WebAuth({
    clientID: 'uVPi7p4ZOIJnvxOIuGF4cMBDJpVHhZNk',
    domain: 'bsavesarvice.auth0.com',
    responseType: 'token id_token',
    audience: 'https://bsavesarvice.auth0.com/userinfo',
    redirectUri: window.location.origin + '/main',
    scope: 'openid profile user_metadata app_metadata'
  });

  constructor(public router: Router) {
  }

  public login(): void {
    this.auth0.authorize(null);
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (!err && !authResult) this.login();
      else {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this.setSession(authResult);
          this.router.navigate(['']);
        } else if (err) {
          this.router.navigate(['/not-authorized']);
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
        }
      }
    });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      localStorage.setItem('scopes', JSON.stringify(scopes));

  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public userHasScopes(scopes: Array<string>): boolean {
    const grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
    return scopes.every(scope => grantedScopes.includes(scope));
  }


}
