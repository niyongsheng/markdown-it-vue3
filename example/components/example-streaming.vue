<template>
  <div class="container">
    <textarea class="md-text" v-model="editableContent" />
    <div class="md-body">
      <div class="controls">
        <button
          class="btn btn-primary"
          @click="startStreaming"
          :disabled="isStreaming"
        >
          Start Stream
        </button>
        <button
          class="btn btn-secondary"
          @click="reset"
        >
          Reset
        </button>
        <div class="speed-control">
          <label for="speed">Speed:</label>
          <input
            id="speed"
            type="range"
            min="1"
            max="10"
            v-model="speed"
            :disabled="isStreaming"
          />
          <span>{{ speed }}x</span>
        </div>
      </div>
      <div class="markdown-container">
        <MarkdownItVueStreaming
          :content="streamContent"
          :streaming="isStreaming"
          :theme="theme"
          html
          @render-complete="onRenderComplete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import MarkdownItVueStreaming from '../../src/markdown-it-vue-streaming.vue'
import exampleContent from './example.js'

export default {
  name: 'StreamingExample',
  components: {
    MarkdownItVueStreaming
  },
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  setup() {
    const editableContent = ref(exampleContent)

    const streamContent = ref('')
    const isStreaming = ref(false)
    const speed = ref(5)
    let sourceContent = ''

    const getRandomDelay = () => {
      // speed 1-10, delay 100-10ms (higher speed = lower delay)
      const maxDelay = 110 - speed.value * 10
      const minDelay = Math.max(5, maxDelay - 30)
      return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
    }

    const startStreaming = async () => {
      if (isStreaming.value) return

      streamContent.value = ''
      sourceContent = editableContent.value
      isStreaming.value = true

      for (let i = 0; i < sourceContent.length; i++) {
        if (!isStreaming.value) break

        streamContent.value += sourceContent[i]
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()))
      }

      isStreaming.value = false
    }

    const reset = () => {
      isStreaming.value = false
      streamContent.value = ''
    }

    const onRenderComplete = () => {
      console.log('Streaming render complete')
    }

    return {
      editableContent,
      streamContent,
      isStreaming,
      speed,
      startStreaming,
      reset,
      onRenderComplete
    }
  }
}
</script>

<style scoped>
.container {
  display: inline-flex;
  width: 100%;
}

.md-text {
  width: 47%;
  resize: vertical;
  min-height: 500px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;
}

.md-text:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.md-body {
  width: 50%;
  margin-left: 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
}

.speed-control input[type="range"] {
  width: 100px;
  cursor: pointer;
}

.speed-control input[type="range"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #40a9ff;
}

.btn-primary:active:not(:disabled) {
  background-color: #096dd9;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d9d9d9;
}

.btn-secondary:active:not(:disabled) {
  background-color: #bfbfbf;
}

.markdown-container {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  min-height: 340px;
}
</style>
