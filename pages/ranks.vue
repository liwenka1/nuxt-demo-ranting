<template>
  <div class="container p-4 sm:px-0 sm:mx-auto sm:pb-0">
    <header class="flex items-center mb-2">
      <h1 class="text-2xl font-bold">Ranks</h1>
      <span class="w-3 h-3 rounded-full animate-ping bg-sky-400 ml-4" v-if="pending"></span>
    </header>

    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th>Uid</th>
          <th>r1</th>
          <th>r2</th>
          <th>r3</th>
          <th>r4</th>
          <th>r5</th>
          <th>avg</th>
          <th>voted</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in formattedData" :key="item.uid">
          <td>{{ item.uid }}</td>
          <td>{{ item.r1 }}</td>
          <td>{{ item.r2 }}</td>
          <td>{{ item.r3 }}</td>
          <td>{{ item.r4 }}</td>
          <td>{{ item.r5 }}</td>
          <td>{{ item.avg }}</td>
          <td>{{ item.voted }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { RankItem } from '~/types'
import { getAvg } from '~/utils'

const { data, pending } = useFetch('/api/ranks', {
  default() {
    return {}
  }
})

const formattedData = computed<RankItem[]>(() => {
  const items = [] as RankItem[]
  if (!data.value) return items
  for (const key in data.value) {
    const value = data.value[key as keyof typeof data.value] || ''
    if (value) {
      const item = JSON.parse(value)
      const [avg, voted] = getAvg(item)
      items.push({
        uid: key.replace(/^\${3}-/, ''),
        avg,
        voted,
        ...item
      })
    }
  }
  return items
})
</script>

<style lang="scss" scoped></style>
