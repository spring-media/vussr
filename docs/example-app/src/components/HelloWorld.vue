<template>
  <p id="app">{{ greeting }} World!</p>
</template>

<script>
module.exports = {
  data: () => ({ greeting: 'Hello' }),
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
