<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal__block">
        <form class="modal__form-login" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="modal__logo">
              <img src="/assets/img/logo_modal.png" alt="logo" />
            </div>
          </NuxtLink>

          <input
            v-model.trim="email"
            class="modal__input"
            type="email"
            placeholder="Почта"
          />

          <input
            v-model.trim="password"
            class="modal__input"
            type="password"
            placeholder="Пароль"
          />

          <input
            v-if="isSignUp"
            v-model.trim="confirmPassword"
            class="modal__input"
            type="password"
            placeholder="Повторите пароль"
          />

          <button class="modal__btn-submit" type="submit">
            {{ isSignUp ? "Зарегистрироваться" : "Войти" }}
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
import { ref, computed } from 'vue'
import { showError } from '#app'

const route = useRoute()
const router = useRouter()
const isSignUp = computed(() => route.path.includes("signup"))

// Используем отдельные ref вместо объекта form
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleSubmit = () => {
  if (!email.value.trim() || !password.value.trim()) {
    showError({
      statusCode: 400,
      message: 'Заполните email и пароль'
    })
    return
  }

  if (isSignUp.value && !confirmPassword.value.trim()) {
    showError({
      statusCode: 400,
      message: 'Заполните поле подтверждения пароля'
    })
    return
  }

  console.log('Форма отправлена:', { 
    email: email.value, 
    password: password.value, 
    confirmPassword: confirmPassword.value 
  })
  router.push('/')
}
</script>


<style lang="scss" scoped>
.wrapper {
  background-color: #000;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__block {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #d0cece;
  border-radius: 6px;
  font-size: 16px;
  color: #333;
  background-color: transparent;

  &:focus {
    border-color: #580ea2;
    outline: none;
  }
}

.modal__btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #580ea2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3f007d;
  }
}

.modal__btn-switch {
  width: 100%;
  padding: 14px;
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #d0cece;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d0cece;
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
.error-message {
  color: #ff4d4d;
  background: #ffe6e6;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #ffcccc;
  font-size: 14px;
}
</style>
