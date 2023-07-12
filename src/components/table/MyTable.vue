<template>
  <table>
    <thead class="table-header">
      <th class="table-header-item" v-for="item in staticHeader" :key="item.id">
      <td class="table-header-ceil">{{ item.title }}</td>
      </th>
    </thead>
    <tbody>
      <tr v-for="item in listItems" :key="item.id" :class="{ 'active': activeItem.id === item.id }"
        @click="applyCurrentItem(item)" class="table-row">
        <td class="table-body-ceil">{{ item.name }}</td>
        <td class="table-body-ceil">{{ item.max }}</td>
        <td class="table-body-ceil">{{ item.min }}</td>
        <td class="table-body-ceil">{{ item.current_weather.winddirection }}</td>
      </tr>
      <tr v-if="loading" class="table-row clear">
        <td class="table-body-ceil"></td>
        <td class="table-body-ceil"></td>
        <td class="table-body-ceil"></td>
        <td class="table-body-ceil"></td>
      </tr>
    </tbody>
  </table>
  <div v-if="loading" class="loader">
    <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
      y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
      <path fill="#fff"
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50"
          to="360 50 50" repeatCount="indefinite" />
      </path>
    </svg>
  </div>
</template>

<script>

const STATIC_HEADER = [
  {
    id: 1,
    title: 'City',
  },
  {
    id: 2,
    title: 'Temparature max'
  },
  {
    id: 3,
    title: 'Temparature min'
  },
  {
    id: 4,
    title: 'Wind direction'
  }
];

import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    listItems: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      staticHeader: STATIC_HEADER,
      currentItem: {}
    }
  },
  watch: {
    listItems(newVal) {
      console.log(newVal);

      this.currentItem = this.listItems[0],
        this.applyCurrentItem(this.currentItem)
    },
    currentItem(newVal) {
      this.currentItem = newVal;
      this.applyCurrentItem(newVal)
    }
  },
  methods: {
    applyCurrentItem(item) {
      this.currentItem = item,
        this.$emit('current-item', this.currentItem)
    }
  },
  computed: {
    activeItem() {
      this.applyCurrentItem(this.currentItem.id ? this.currentItem : this.listItems[0])
      return this.currentItem.id ? this.currentItem : this.listItems[0];
    }
  }
})
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.table {
  position: relative;
}

.loader {
  position: absolute;
  z-index: 5;
  width: 200px;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
}

.table table {
  width: 100%;
  border: 1px solid #1A1A1A;
  border-radius: 12px;
  border-spacing: 1px;
  position: relative;
  z-index: 0;



  .table-header-item {
    background: #030303;
    border-top: 1px solid #313131;

    .table-header-ceil {
      text-align: center;
      width: inherit;
      padding: 9px 0;
    }

    &:nth-child(1) {
      border-top-left-radius: 12px;
      border-left: 1px solid #313131;

      .table-header-ceil {
        text-align: left;
        padding-left: 20px;
      }
    }

    &:nth-last-child(1) {
      border-top-right-radius: 12px;
      border-right: 1px solid #313131;

      .table-header-ceil {
        text-align: right;
        padding-right: 20px;
      }
    }
  }

  .table-row .table-body-ceil {
    text-align: right;
    padding: 9px 0;
    padding-right: 16px;
  }

  .table-row .table-body-ceil:nth-child(1) {
    border-left: 1px solid #313131;
    text-align: left;
    padding-left: 16px;
  }

  .table-row .table-body-ceil:nth-last-child(1) {
    border-right: 1px solid #313131;
  }

  .table-row:nth-child(even) {
    background: #313131;
  }

  .table-row {
    height: 36px;
    transition: ease .4s;

    &.active {
      background: #774747;

    }

    &:hover {
      cursor: pointer;
      background: #6a5151;
    }
  }

  .table-row.clear {
    height: 100%;
  }

  .table-row:nth-last-child(1) {
    .table-body-ceil {
      border-bottom: 1px solid #313131;
    }

    .table-body-ceil:nth-child(1) {
      border-bottom-left-radius: 12px;
    }

    .table-body-ceil:nth-last-child(1) {
      border-bottom-right-radius: 12px;
    }
  }

  .table-header-item,
  .table-body-ceil {
    width: 25%;
    color: #FDFCFF;
    font-family: Helvetica;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
  }
}
</style>