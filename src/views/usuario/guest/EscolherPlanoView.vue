<script setup>

import { ref } from 'vue';

import { RouterLink } from 'vue-router';


const plans = ref([

    { id: 1, name: 'Plano Mensal', price: 'R$ 99,90', description: 'Acesso completo por 30 dias.' },

    { id: 2, name: 'Plano Trimestral', price: 'R$ 269,70', description: 'Economize com o plano de 3 meses.' },

    { id: 3, name: 'Plano Anual', price: 'R$ 958,80', description: 'O melhor custo-benefício para um ano de treinos.' }

]);

</script>

<template>

    <div class="escolher-plano-container">

        <h1>Escolha seu Plano</h1>

        <p>Selecione o plano que melhor se adapta aos seus objetivos.</p>

        <div class="planos-grid">

            <div v-for="plan in plans" :key="plan.id" class="plano-card">

                <h2>{{ plan.name }}</h2>

                <p class="price">{{ plan.price }}</p>

                <p>{{ plan.description }}</p>

                <RouterLink :to="`/assinar-plano/${plan.id}`" class="btn-assinar">

                    Assinar Agora

                </RouterLink>

            </div>

        </div>

    </div>

</template>

<style scoped>
.escolher-plano-container {

    max-width: 1200px;

    margin: 2rem auto;

    padding: 2rem;

    text-align: center;

}

h1 {

    color: var(--neutral-900);

    margin-bottom: 0.5rem;

}

p {

    color: var(--neutral-600);

    margin-bottom: 2rem;

}

.planos-grid {

    display: grid;

    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

    gap: 2rem;

}

.plano-card {

    background-color: var(--card-background, #fff);

    border: 1px solid var(--plano-border, #e5e7eb);

    border-radius: 8px;

    padding: 2rem;

    box-shadow: var(--card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));

    transition: transform 0.2s, box-shadow 0.2s;

}

.plano-card:hover {

    transform: translateY(-5px);

    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

}

.plano-card h2 {

    color: var(--plano-text, #111827);

    margin-bottom: 1rem;

}

.plano-card .price {

    font-size: 2rem;

    font-weight: bold;

    color: var(--plano-price, #2563eb);

    margin-bottom: 1rem;

}

.btn-assinar {

    display: inline-block;

    margin-top: 1.5rem;

    padding: 0.75rem 1.5rem;

    background-color: var(--button-primary-bg, #2563eb);

    color: var(--button-primary-text, #fff);

    text-decoration: none;

    border-radius: 6px;

    font-weight: bold;

    transition: background-color 0.2s;

}

.btn-assinar:hover {

    background-color: var(--button-primary-hover, #1d4ed8);

}

/* Desktop: 3 colunas (lado a lado) */
@media (min-width: 768px) {
    .planos-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>