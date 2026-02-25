import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="branding" href="/">
      <img src="images/logo.png" class="branding-logo" alt="logo" />
      @if (showName) {
        <span class="branding-name">Système de Collecte des Données de Laboratoire</span>
      }
    </a>
  `,
  styles: `
    .branding {
      display: flex;
      align-items: center;
      margin: 0 0.5rem;
      text-decoration: none;
      white-space: nowrap;
      color: inherit;
      border-radius: 50rem;
      font-family: 'HelveticaNeue-CondensedBold', Arial, sans-serif;
    }

    .branding-logo {
      width: 5rem;
      height: 3rem;
      border-radius: 50rem;
      float: left;
      margin: 0 10px 0 -10px;
      vertical-align: middle;
      border: 0;
    }

    .branding-name {
      float: left;
      font-size: 1.1em;
      font-weight: bold;

      line-height: 15px;
      margin: 10px 0 0 10px;
      color: #747474;
      text-shadow: 0 1px 0 #fff;
      text-rendering: optimizelegibility;
      margin-block-start: 0.67em;
      margin-block-end: 0.67em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      unicode-bidi: isolate;
      font-family: 'HelveticaNeue-CondensedBold', Arial, sans-serif;
    }
  `,
})
export class Branding {
  @Input() showName = true;
}
