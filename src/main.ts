import { app } from './app';
import { loader } from './loader';

const ENV = process.env.NODE_ENV || 'development';
const APP = process.env.APP || 'all';
console.log(`Environment: ${ENV}`);
console.log(`App: ${APP}`);

switch (APP) {
  case 'chaldea': {
    app.chaldea(loader.loadConfig(APP), loader.loadTemplate(APP), ENV);
    break;
  }
  case 'tmdict': {
    app.tmdict(loader.loadConfig(APP), loader.loadTemplate(APP), ENV);
    break;
  }
  case 'book': {
    app.book(loader.loadConfig(APP), loader.loadTemplate(APP), ENV);
    break;
  }
  case 'all': {
    app.tmdict(loader.loadConfig('tmdict'), loader.loadTemplate('tmdict'), ENV);
    app.book(loader.loadConfig('book'), loader.loadTemplate('book'), ENV);
    if (ENV === 'development') {
      app.chaldea(loader.loadConfig('chaldea'), loader.loadTemplate('chaldea'), ENV);
    }
    break;
  }
  default: {
    console.log(`Unknown app: ${APP}`);
    break;
  }
}

console.log('App and site generation complete!!!');
