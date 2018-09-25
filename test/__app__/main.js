import Vue from 'vue';
import HelloWorld from './HelloWorld.vue';

export default function createApp() {
  return new Vue({ render: h => h(HelloWorld) });
}