<script setup lang="ts">
import { useTableData } from '@/composables/useTableData'

const { data } = useTableData()
</script>

<template>
  <UTable sticky loading loading-animation="carousel" :data="data" class="flex-1 max-h-[312px]" />
</template>
