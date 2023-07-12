<template>
    <div class="filter">
        <div class="trigger-filter">
            <button class="trigger-button" @click="activeDropdown" :class="{ 'active': isActive }">
                <p class="button-title">{{ title }}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="black">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M4.23431 5.83432C4.54673 5.5219 5.05327 5.5219 5.36569 5.83432L8 8.46864L10.6343 5.83432C10.9467 5.5219 11.4533 5.5219 11.7657 5.83432C12.0781 6.14674 12.0781 6.65327 11.7657 6.96569L8.56569 10.1657C8.25327 10.4781 7.74673 10.4781 7.43431 10.1657L4.23431 6.96569C3.9219 6.65327 3.9219 6.14674 4.23431 5.83432Z"
                        fill="#FDFCFF" />
                </svg>
            </button>
        </div>
        <Transition name="fade">
            <div ref="dropdown" class="block-wrapper whithin">
                <div v-show="isActive && filterType === filterTypes.WHITHIN_FILTER" class="dropdown-wrapper">
                    <div v-show="true" class="filter-form-wrapper">
                        <div class="filter-form">
                            <input v-model="minValue" placeholder="Min" type="number">
                            -
                            <input v-model="maxValue" placeholder="Max" type="number">
                        </div>
                        <p class="error" v-if="validation">{{ validation }}</p>
                        <div class="form-button">
                            <button @click="deleteFilter">Reset</button>
                            <button @click="applyFilter" :class="{ 'blur': validation }">Apply</button>
                        </div>
                    </div>
                </div>
                <div v-show="isActive && filterType === filterTypes.COUNTRIES_FILTER" class="dropdown-wrapper coutries">
                    <div v-show="true" class="filter-form-wrapper">
                        <input class="search-input" placeholder="Search country" v-model="searchVal" type="text">
                        <ul class="item-list">
                            <li v-for="item in (countryBySearch.length ? countryBySearch : listItems)" :key="item.id"
                                :class="{ 'checked': item.checked }" class="item" @click="selectCountry(item.id)">{{
                                    item.title }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
  </template>
  
  
  <script lang="ts">
  import { Country, FilterItems } from '../types.d';
  import { defineComponent } from 'vue';
  import { WHITHIN_FILTER, COUNTRIES_FILTER } from '../data/filterTypes';
  
  
  export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        filterType: {
            type: Number,
            required: true
        },
        filterName: {
            type: String,
            required: true
        },
        countries: {
            type: Object as () => Country
        }
    },
    data() {
        return {
            isActive: false,
            filterTypes: {
                WHITHIN_FILTER,
                COUNTRIES_FILTER
            },
            options: [] as FilterItems[],
            searchVal: '',
            minValue: null as null | number,
            maxValue: null as null | number
        }
    },
    mounted() {
        this.setFilterOption()
    },
    methods: {
        deleteFilter(): void {
            this.minValue = null;
            this.maxValue = null;
            this.$emit("filter-number", { min: null, max: null, type: this.filterName })
        },
        applyFilter(): void {
            if (this.minValue !== null && this.maxValue !== null && !this.validation) {
                this.$emit("filter-number", { min: this.minValue, max: this.maxValue, type: this.filterName })
            }
        },
        activeDropdown(): void {
            this.isActive = !this.isActive
        },
        setFilterOption(): void {
            const options: { id: number; title: string; checked: boolean }[] = [];
            let i = 0;
            for (let item in this.countries) {
                options.push({
                    id: ++i,
                    title: item,
                    checked: false,
                })
            }
            this.options = options;
        },
        selectCountry(id: number): void {
            this.options.forEach(item => {
                item.checked = item.id === id ? !item.checked : item.checked;
            });
            this.getCheckedCountries();
        },
        getCheckedCountries(): void {
            const selectedCountries = this.options.filter(el => el.checked)
            this.$emit('filter', selectedCountries)
        },
        checkVal(val: number): boolean {
            return -80 >= val || val >= 80;
        }
    },
    computed: {
        listItems(): FilterItems[] {
            return this.options
        },
        countryBySearch(): FilterItems[] {
            const searchVal: string = this.searchVal;
            let filteredArray: { id: number; title: string; checked: boolean }[] = [];
            if (searchVal) {
                filteredArray = this.options.filter((item) => item.title.toLowerCase().includes(searchVal.toLowerCase()));
            }
            return filteredArray;
        },
        validation(): string {
            const min = this.minValue;
            const max = this.maxValue
            if (max === null || min === null) {
                return 'Need value';
            }
            if (max && min && max < min) {
                return 'Max must be higher than Min';
            }
            if (min && this.checkVal(min)) {
                return 'value expected -80 to 80';
            }
            if (max && this.checkVal(max)) {
                return 'value expected -80 to 80';
            }
            return ''
        }
    }
  })
  </script>
  
  <style lang="scss" scoped>
  * {
    box-sizing: border-box;
  
    &:focus-visible {
        outline: none;
    }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .filter {
    margin-right: 8px;
  }
  
  .trigger-filter,
  .filter {
    position: relative;
    z-index: 1;
  }
  
  .trigger-filter .trigger-button {
    display: flex;
    width: 160px;
    height: 40px;
    padding: 11px 16px;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    border: 1px solid #515151;
    background: #313131;
    color: #A4A4A4;
    font-family: Helvetica;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    transition: ease .4s;
  
    &:focus {
        border-color: #d7d7d7;
    }
  
    &:hover {
        cursor: pointer;
        border-color: #d7d7d7;
    }
  
    &.active {
        border-color: #d7d7d7;
    }
  
    svg {
        transition: ease .4s;
    }
  
    &.active svg {
        transform: rotate(180deg);
    }
  }
  
  .dropdown-wrapper {
    position: absolute;
    width: 160px;
    background: #313131;
    border-radius: 12px;
    padding: 10px;
    padding-top: 25px;
    margin-top: -20px;
    z-index: 0;
    border: 1px solid #8b8b8b;
  
    &.coutries {
        padding: 20px 0 0 0;
    }
  
    .filter-form {
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  
    .filter-form-wrapper input {
        width: 60px;
        border: 1px solid #8b8b8b;
        background: transparent;
        border-radius: 12px;
        padding: 7px;
        color: #A4A4A4;
  
  
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
  
        & {
            -moz-appearance: textfield;
        }
  
        &:focus-visible {
            outline: none;
        }
  
        &:focus {
            border-color: #d7d7d7;
        }
    }
  
    .filter-form-wrapper .search-input {
        border: 1px solid #8b8b8b;
        background: transparent;
        border-radius: 12px;
        padding: 7px;
        width: 100%;
        color: #A4A4A4;
    }
  
    .error {
        font-family: Helvetica;
        font-size: 16px;
        font-weight: 700;
        line-height: 18px;
        color: #a41515;
    }
  
    .filter-form-wrapper ul.item-list {
        list-style: none;
        text-decoration: none;
        padding: 0;
        margin: 0;
        max-height: 250px;
        overflow: auto;
  
        .item {
            padding: 10px 5px;
            font-family: Helvetica;
            font-size: 14px;
            font-weight: 500;
            line-height: 18px;
            color: #A4A4A4;
  
            &:hover {
                box-shadow: inset 0px 10px 30px -15px #8b8b8b;
                cursor: pointer;
            }
  
            &.checked {
                box-shadow: inset 0px 10px 30px -15px #8b8b8b;
            }
        }
    }
  
    .form-button {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
  
        button {
            width: 60px;
            border: 1px solid #8b8b8b;
            background: transparent;
            border-radius: 6px;
            padding: 5px;
            color: white;
            transition: ease .4s;
  
            &.blur {
                opacity: .5;
                pointer-events: none;
            }
  
            &:nth-last-child(1) {
                background: #030303;
                margin-left: 5px;
            }
  
            &:hover {
                cursor: pointer;
                border-color: #c4c4c4;
            }
  
            &:focus {
                border-color: #d7d7d7;
            }
        }
    }
  }
  </style>