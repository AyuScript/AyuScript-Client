import { createApp } from 'vue';
import App from './App.vue';
import {createI18n} from "vue-i18n";
import en from './locales/en.json';
import zh from './locales/zh.json';

const florrLang: string = (localStorage.getItem("florrio_lang") || navigator.language || 'en') + '';
const locale = florrLang.indexOf('zh') === 0 ? 'zh' : 'en';

switch (location.host) {
  case "florr.io":
    const i18n = createI18n({
      locale,
      fallbackLocale: 'en',
      messages: {
        en: en,
        zh: zh,
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