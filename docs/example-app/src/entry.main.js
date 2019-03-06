import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

class UnknowRouteError extends Error {
  constructor(url) {
    super(`Route "${url}" did not match any routes`);
    this.statusCode = 404;
  }
}

export default async context => {
  if (context.url === '/') {
    const render = h => h(HelloWorld);
    return new Vue({ render });
  } else {
    throw new UnknowRouteError(context.url);
  }
};
