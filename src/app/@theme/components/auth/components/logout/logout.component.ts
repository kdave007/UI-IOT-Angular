/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';
import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { LogoutCustomService } from '../../../../../services/logout-custom.service';

@Component({
  selector: 'nb-logout',
  templateUrl: './logout.component.html',
})
export class NbLogoutComponent implements OnInit {

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(protected service: NbAuthService,private customService: LogoutCustomService,
  @Inject(NB_AUTH_OPTIONS) protected options = {},
  protected router: Router) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnInit(): void {

    this.logout(this.strategy);
    localStorage.removeItem('auth_app_token');//clears the token
    localStorage.removeItem('userInfo');
    this.router.navigateByUrl('/auth/login');//redirects to Login window
  }

  logout(strategy: string): void {

  this.customService.postOUT().subscribe(got => {/*console.log("logged out")*/});
    this.service.logout(strategy).subscribe((result: NbAuthResult) => {

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
