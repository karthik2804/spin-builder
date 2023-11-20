<script lang="ts" setup>
import { computed } from 'vue'
import type { EdgeProps, Position } from '@vue-flow/core'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'
import { useStore } from '../../store';

let store = useStore()

interface CustomEdgeProps extends EdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  data: any
  markerEnd: string
}

let interactionModeLocked = computed(() => store.state.interactionModeLocked)

const props = defineProps<CustomEdgeProps>()
const path = computed(() => getBezierPath(props))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseEdge :path="path[0]" :marker-end="markerEnd" :style="{ stroke: data.active ? 'red' : '' }" />

  <EdgeLabelRenderer v-if="!interactionModeLocked">
    <div :style="{
      pointerEvents: 'all',
      position: 'absolute',
      transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
    }
      " class="nodrag nopan">
      <button class="edgebutton" @click="$emit('removeEdge', id)">×</button>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edgebutton {
  border-radius: 999px;
  cursor: pointer;
}

.edgebutton:hover {
  color: red;
  box-shadow: 0 0 0 2px pink, 0 0 0 4px #f05f75;
}
</style>
