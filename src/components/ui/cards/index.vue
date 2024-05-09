<template>
    <div class="product-card-table">
        <div class="product-card-table__main-info">
            <picture>
                <source :srcset="`https://romb-art.ru`+item.img" />
                <img/>
            </picture>
            
            <h3 class="product-card-table__name">{{ item.name }}</h3>
        </div>
        <div class="product-card-table__price"><span class="product-card-table__hidden-header">Цена</span>
            <p>{{ priceFormated }} ₽/м<sup>2</sup></p>
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во метров</span>
            <div>
                <div class="product-card-table__quantity-block quantity-block" data-quantity-square=""><button
                        class="quantity-block__button" data-minus-btn=""><svg width="6" height="4" viewBox="0 0 6 4"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 3.11501V0.88501H5.56V3.11501H0Z" fill="white"/>
                        </svg></button>
                    <div class="quantity-block__count-wrapper">
                        <input class="quantity-block__count" type="number" value="1" data-quantity=""/>
                        <span class="quantity-block__measure">м<sup>2</sup></span></div>
                    <button class="quantity-block__button" data-plus-btn=""><svg width="12" height="12"
                            viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.85006 11.02V6.90998H0.560059V5.08998H4.85006V0.97998H6.75006V5.08998H11.0401V6.90998H6.75006V11.02H4.85006Z"  fill="white"/>
                        </svg></button>
                </div>
            </div>
        </div>
        <div class="product-card-table__col"><span class="product-card-table__hidden-header">Кол-во поддонов</span>
            <CounterBlock/>
        </div>
        <div class="product-card-table__total"><span class="product-card-table__hidden-header">Итог</span>
            <p>{{totalPriceFormated}} ₽/м<sup>2 </sup></p>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { OrderItem } from '@/helpers/api';
import { computed } from 'vue';

import { CounterBlock } from '../counterBlock';

interface IProps {
    item : OrderItem
}

const props = defineProps<IProps>();

const priceFormated = computed( ( ) => props.item.price.toLocaleString('ru-RU'));
const totalPriceFormated = computed( ( ) => props.item.totalPrice.toLocaleString('ru-RU'));
</script>