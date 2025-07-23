<template>
 <div class="error-page">
 <div class="error-content">
 <div class="error-code">{{ error.statusCode || '500' }}</div>
 <h1 class="error-title">{{ errorTitle }}</h1>
 <p class="error-message">{{ errorDescription }}</p>

 <div class="action-buttons">
 <NuxtLink 
 v-if="showBackToLogin"
 to="/login"
 class="action-link"
 >
 <svg class="link-icon" viewBox="0 0 24 24">
 <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
 </svg>
 Вернуться к авторизации
 </NuxtLink>

 <NuxtLink 
 to="/" 
 class="action-link"
 >
 <svg class="link-icon" viewBox="0 0 24 24">
 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
 <polyline points="9 22 9 12 15 12 15 22"/>
 </svg>
 На главную страницу
 </NuxtLink>
 </div>
 </div>
 </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
 error: {
 type: Object,
 required: true
 },
 showBackToLogin: {
 type: Boolean,
 default: false
 }
});

const errorTitles = {
 400: 'Неверный запрос',
 401: 'Ошибка авторизации',
 403: 'Доступ запрещён',
 404: 'Страница не найдена',
 500: 'Ошибка сервера'
};

const errorDescriptions = {
 400: 'Проверьте правильность введённых данных',
 401: 'Требуется авторизация для доступа к ресурсу',
 403: 'У вас недостаточно прав для просмотра этой страницы',
 404: 'Запрошенная страница не существует или была перемещена',
 500: 'Внутренняя ошибка сервера. Попробуйте позже'
};

const errorTitle = computed(() => 
 props.error.title || errorTitles[props.error.statusCode] || 'Неизвестная ошибка'
);

const errorDescription = computed(() => 
 props.error.description || errorDescriptions[props.error.statusCode] || 
 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз'
);

const showBackToLogin = computed(() => 
 props.showBackToLogin || [401, 403].includes(props.error.statusCode)
);
</script>

<style scoped>
.error-page {
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 background: linear-gradient(45deg, #1a1a1a, #2d2d2d);
 padding: 2rem;
}

.error-content {
 text-align: center;
 max-width: 600px;
 padding: 2.5rem;
 background: rgba(0, 0, 0, 0.8);
 border-radius: 16px;
 backdrop-filter: blur(10px);
 box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
 border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-code {
 font-size: 6rem;
 font-weight: 700;
 color: #ff4757;
 text-shadow: 0 0 15px rgba(255, 71, 87, 0.4);
 margin-bottom: 1rem;
}

.error-title {
 font-size: 2rem;
 color: #ffffff;
 margin-bottom: 1.5rem;
 font-weight: 600;
}

.error-message {
 font-size: 1.1rem;
 color: #a0a0a0;
 line-height: 1.6;
 margin-bottom: 2rem;
}

.action-buttons {
 display: flex;
 flex-direction: column;
 gap: 1rem;
 margin-top: 2rem;
}

.action-link {
 display: inline-flex;
 align-items: center;
 gap: 0.75rem;
 padding: 0.9rem 1.8rem;
 background: #ad61ff;
 color: white;
 border-radius: 8px;
 text-decoration: none;
 font-weight: 500;
 transition: all 0.3s ease;
 border: 2px solid transparent;
}

.action-link:hover {
 background: transparent;
 border-color: #ad61ff;
 transform: translateY(-2px);
 box-shadow: 0 4px 15px rgba(173, 97, 255, 0.3);
}

.link-icon {
 width: 1.25rem;
 height: 1.25rem;
 stroke-width: 2;
}

@media (max-width: 768px) {
 .error-code {
 font-size: 4rem;
 }
 
 .error-title {
 font-size: 1.5rem;
 }
 
 .error-message {
 font-size: 1rem;
 }
 
 .action-link {
 padding: 0.75rem 1.5rem;
 }
}
</style>
