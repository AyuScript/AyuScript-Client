import { createApp } from 'vue';
import App from './App.vue';

switch (location.host) {
  case "florr.io":
    createApp(App).mount(
      (() => {
        const app = document.createElement('div');
        document.body.append(app);
        return app;
      })(),
    );
}