<template>
  <p>Component for test</p>
</template>

<script>
export default {
  fetch({ req, store }) {
    try {
      req.test(store);
    } catch (error) {
      throw error;
    }
  },
};
</script>
