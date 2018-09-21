<template>
  <p>Component for test</p>
</template>

<script>
export default {
  async fetch(context) {
    const { req } = context;
    try {
      await req.test(context);
    } catch (error) {
      throw error;
    }
  },
};
</script>
