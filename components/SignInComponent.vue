<template>
 <div class="wrapper">
 <div class="container-signup">
 <div class="modal__block">
 <form class="modal__form-login" @submit.prevent="handleSubmit">
 <NuxtLink to="/">
 <div class="modal__logo">
 <img src="/assets/img/logo_modal.png" alt="logo">
 </div>
 </NuxtLink>

 <input
 v-model.trim="form.email"
 class="modal__input"
 type="email"
 placeholder="Почта"
 >

 <input
 v-model.trim="form.password"
 class="modal__input"
 type="password"
 placeholder="Пароль"
 >

 <input
 v-if="isSignUp"
 v-model.trim="form.confirmPassword"
 class="modal__input"
 type="password"
 placeholder="Повторите пароль"
 >

 <button class="modal__btn-submit" type="submit">
 {{ isSignUp ? 'Зарегистрироваться' : 'Войти' }}
 </button>

 <button
 v-if="!isSignUp"
 class="modal__btn-switch"
 type="button"
 @click="$router.push('/signup')"
 >
 Зарегистрироваться
 </button>
 </form>
 </div>
 </div>
 </div>
</template>

<script setup>
const route = useRoute()
const isSignUp = computed(() => route.path.includes('signup'))

const form = reactive({
 email: '',
 password: '',
 confirmPassword: ''
})

const validateForm = () => {
 //Пробелы и пустые поля
 const fieldsToCheck = isSignUp.value 
 ? ['email', 'password', 'confirmPassword']
 : ['email', 'password']

 for (const field of fieldsToCheck) {
 if (!form[field].trim()) {
 alert(`Поле ${field === 'email' ? 'Почта' : 'Пароль'} обязательно для заполнения`)
 return false
 }
 }

 // Проверка совпадения паролей при регистрации
 if (isSignUp.value && form.password !== form.confirmPassword) {
 alert('Пароли не совпадают')
 return false
 }

 return true
}

const handleSubmit = () => {
 if (!validateForm()) return
  
 // Здесь потом будет вызов API
 console.log('Форма валидна, данные:', {
 email: form.email,
 password: form.password
 })
}
</script>

<style lang="scss" scoped>
.wrapper {
 background-color: #000; /* Чёрный фон */
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
}

.modal__block {
 background: white; /* Восстановлен исходный белый фон модального окна */
 border-radius: 12px;
 box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Восстановлена исходная тень */
 width: 366px;
 padding: 40px;
}

.modal__form-login {
 display: flex;
 flex-direction: column;
 gap: 20px;
}

.modal__input {
 width: 100%;
 padding: 12px 16px;
 border: 1px solid #d0cece; /* Восстановлены исходные цвета границ */
 border-radius: 6px;
 font-size: 16px;
 color: #333; /* Восстановлен исходный цвет текста */
 background-color: transparent; /* Убран фон полей ввода */

 &:focus {
 border-color: #580ea2;
 outline: none;
 }
}

.modal__btn-submit {
 width: 100%;
 padding: 14px;
 background-color: #580ea2; /* Восстановлен исходный фиолетовый цвет */
 color: white;
 border: none;
 border-radius: 6px;
 font-size: 16px;
 cursor: pointer;
 transition: background-color 0.3s ease;

 &:hover {
 background-color: #3f007d; /* Восстановлен эффект наведения */
 }
}

.modal__btn-switch {
 width: 100%;
 padding: 14px;
 background-color: #f5f5f5; /* Восстановлен серый фон кнопки */
 color: #666; /* Восстановлен цвет текста */
 border: 1px solid #d0cece; /* Восстановлены цвета границ */
 border-radius: 6px;
 font-size: 16px;
 cursor: pointer;
 transition: all 0.3s ease;

 &:hover {
 background-color: #d0cece; /* Восстановлен эффект наведения */
 }
}

.modal__logo {
 text-align: center;
 margin-bottom: 30px;

 img {
 max-width: 140px;
 height: auto;
 }
}
</style>