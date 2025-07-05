import { createApp } from 'vue';
import App from './App.vue';
import {createI18n} from "vue-i18n";
import en from './locales/en.json';

switch (location.host) {
  case "florr.io":
    const i18n = createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: en,
      },
    });
    const app = createApp(App);
    app.use(i18n);
    app.mount(
      (() => {
        const app = document.createElement('div');
        document.body.append(app);
        return app;
      })(),
    );
}