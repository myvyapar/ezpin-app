import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DynamicScript {
  captchaCode = environment.captchaCode;
  loadReCaptcha() {
    // return new Promise<void>((resolve, reject) => {
    //   const scriptElement = window.document.createElement('script');
    //   scriptElement.src = 'https://www.google.com/recaptcha/api.js';
    //   scriptElement.async;
    //   scriptElement.defer;
    //   scriptElement.onload = () => {
    //     resolve();
    //   };

    //   scriptElement.onerror = () => {
    //     reject();
    //   };

    //   window.document.body.appendChild(scriptElement);
    // });

    const isCaptchaRendered = !!document.getElementById('recaptcha');
    if (isCaptchaRendered) {
        return;
    } else {
        return new Promise((resolve, reject) => {
            const scriptElement = window.document.createElement('script');
            scriptElement.id = 'test';
            scriptElement.src = `https://www.google.com/recaptcha/api.js?render=${this.captchaCode}`;
            scriptElement.async;
            scriptElement.defer;
            scriptElement.onload = () => {
                resolve('');
            };
            scriptElement.onerror = () => {
                reject();
            };
            window.document.body.appendChild(scriptElement);
        });
    }
  }


  loadFreshWorkWidget() {
    return new Promise<void>((resolve, reject) => {
      const innerWidget = window.document.createElement('script');
      innerWidget.innerHTML = `window.fwSettings = {
            'widget_id': 67000001041,
            'locale': 'en'
          };
          ! function () {
            if ("function" != typeof window.FreshworksWidget) {
              var n = function () {
                n.q.push(arguments)
              };
              n.q = [], window.FreshworksWidget = n
            }
          }()`;

      const scriptElement = window.document.createElement('script');
      scriptElement.src =
        'https://widget.freshworks.com/widgets/67000001041.js';
      scriptElement.async;
      scriptElement.defer;

      scriptElement.onload = () => {
        resolve();
      };

      scriptElement.onerror = () => {
        reject();
      };

      window.document.body.appendChild(scriptElement);
      window.document.body.appendChild(innerWidget);
    });
  }
}
