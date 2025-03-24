<template>
    <div class="w-full min-h-screen bg-gray-50 flex flex-row justify-start items-start">
        <sidenav :user="$page.props.user" />
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import sidenav from '~/components/sidenav.vue'
</script>
