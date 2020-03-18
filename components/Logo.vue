<template>
  <img class="logo" @click="$router.push('/')" :src="require('@/assets/waxshop.svg')" title="Wax Shop Staff Home" />
</template>
<style>
.logo {
  cursor: pointer;
  /* animation: 1s appear; */
  /* margin: auto; */
  width: 75%;
  max-width: 500px;
  /* margin-bottom: auto; */
}

/* @keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
} */
</style>
