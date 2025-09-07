<script lang="ts">
import { state } from '@/ws/socket';

export default {
  name: 'ConnectionState',

  computed: {
    connected() {
      return state.connected;
    }
  }
};
</script>

<template>
  <p>State: {{ connected }}</p>
</template>
