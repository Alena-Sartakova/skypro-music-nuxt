<template>
  <div class="wrapper">
    <div class="container-signup">
      <div class="modal__block">
        <form class="modal__form-login" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="modal__logo">
              <NuxtImg
                src="/assets/img/logo_modal.png"
                alt="logo"
                loading="eager"
                format="png"
                quality="100"
              />
            </div>
          </NuxtLink>

          <!-- Уведомления -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="userStore.error" class="error-message">
            {{ userStore.error }}
          </div>

          <!-- Поля формы -->
          <input
            v-model.trim="email"
            class="modal__input"
            type="email"
            placeholder="Почта"
            :disabled="userStore.loading"
          />

          <input
            v-model.trim="password"
            class="modal__input"
            type="password"
            placeholder="Пароль"
            :disabled="userStore.loading"
          />

          <input
            v-if="isSignUp"
            v-model.trim="confirmPassword"
            class="modal__input"
            type="password"
            placeholder="Повторите пароль"
            :disabled="userStore.loading"
          />

          <!-- Кнопки -->
          <button
            class="modal__btn-submit"
            type="submit"
            :disabled="userStore.loading"
          >
            <template v-if="!userStore.loading">
              {{ isSignUp ? "Зарегистрироваться" : "Войти" }}
            </template>
            <div v-else class="loader"></div>
          </button>

          <button
            v-if="!isSignUp"
            class="modal__btn-switch"
            type="button"
            @click="$router.push('/signup')"
            :disabled="userStore.loading"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUser";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isSignUp = computed(() => route.path.includes("signup"));
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const successMessage = ref("");

const validateForm = () => {
  userStore.error = null;

  if (!email.value.trim() || !password.value.trim()) {
    userStore.error = "Заполните email и пароль";
    return false;
  }

  if (isSignUp.value) {
    if (!confirmPassword.value.trim()) {
      userStore.error = "Заполните поле подтверждения пароля";
      return false;
    }
    if (password.value !== confirmPassword.value) {
      userStore.error = "Пароли не совпадают";
      return false;
    }
    if (password.value.length < 6) {
      userStore.error = "Пароль должен содержать минимум 6 символов";
      return false;
    }
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const credentials = {
      email: email.value,
      password: password.value,
    };

    // Логирование отправляемых данных
    console.log("Отправка данных в API:", {
      type: isSignUp.value ? "Регистрация" : "Вход",
      data: isSignUp.value 
        ? { ...credentials, username: email.value.split("@")[0] }
        : credentials
    });

    let apiResponse;
    if (isSignUp.value) {
      apiResponse = await userStore.signup({
        ...credentials,
        username: email.value.split("@")[0]
      });
    } else {
      apiResponse = await userStore.login(credentials);
    }

    // Логирование ответа API
    console.log("Ответ API:", {
      status: "success",
      data: apiResponse,
      isAuthenticated: userStore.isAuthenticated
    });

    if (userStore.isAuthenticated) {
      successMessage.value = isSignUp.value
        ? "Регистрация прошла успешно! Перенаправляем..."
        : "Вход выполнен! Перенаправляем...";
      
      setTimeout(() => {
        router.replace("/");
        successMessage.value = "";
      }, 1500);
    }
  } catch (error) {
    console.error("Ошибка API:", {
      status: "error",
      message: error.message,
      response: error.response?.data
    });
    
    if (isSignUp.value) email.value = "";
    password.value = "";
    confirmPassword.value = "";
  }
};
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
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #580ea2;
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
  transition: background-color 0.3s ease, opacity 0.3s ease;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: #3f007d;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

  &:hover:not(:disabled) {
    background-color: #d0cece;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #a5d6a7;
  animation: slideIn 0.3s ease;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #ffcdd2;
  animation: shake 0.4s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .modal__block {
    width: 90%;
    padding: 25px;
    margin: 0 auto;
  }

  .modal__form-login {
    gap: 15px;
  }
}
</style>
