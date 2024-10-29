<template>
  <svg
    :x="x" :y="y"
    :width="width"
    height="16"
    :style="{cursor: dragging?'grabbing':'grab'}"
    @mouseenter="hover=true"
    @mouseleave="hover=false"
  >
    <rect
      fill="#000"
      :fill-opacity="titleFillOpacity"
      x="0" y="0"
      rx="3" ry="3"
      :width="width"
      height="16"
    />
    <svg x="0" y="0" :width="deletable ? width - 17 : width" height="16">
      <title>{{ title }} {{ category }}</title>

      <!-- Spinner group positioned at the start before title and category -->
      <g v-if="loading" transform="translate(8, 8)">
        <circle
          r="4"
          cx="0"
          cy="0"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          stroke-dasharray="10"
          stroke-dashoffset="2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <text 
        :x="loading ? 20 : 2" 
        y="13" 
        font-size="15" 
        font-weight="normal" 
        fill="#fff"
      >
        {{ title + " &lt;" + category + "&gt;" }}
      </text>
    </svg>

    <svg
      v-if="deletable"
      :x="width - 15" y="1"
      width="14" height="14"
      class="diagram-editor__delete"
      @click="$emit('delete')"
    >
      <rect
        x="0"
        y="0"
        width="14"
        height="14"
        rx="2" ry="2"
      />
      <line
        :x1="1" :y1="1"
        :x2="13" :y2="13"
      />
      <line
        :x1="13" :y1="1"
        :x2="1" :y2="13"
      />
    </svg>
  </svg>
</template>

<script>
export default {
  name: 'DiagramNodeTitle',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'default'
    },
    deletable: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: '#4249FF'
    },
    dragging: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      hover: false,
      loading: this?.state === 'running'
    };
  },
  watch: {
    state(newValue) {
      this.loading = newValue === 'running';
    }
  },
  computed: {
    titleFillOpacity() {
      return this.hover ? 0.7 : 0.5;
    }
  },
};
</script>