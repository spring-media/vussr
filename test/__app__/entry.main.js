import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from './HelloWorld.vue';

export default () => {
  const render = h => h(HelloWorld);

  const router = new Router({
		mode: 'history',
		routes: [{ path: '/', component: HelloWorld, name: 'HelloWorld' }],
  });

  const app = new Vue({ render, router });

  return { app, router };
};