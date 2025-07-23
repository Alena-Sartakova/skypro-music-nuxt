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
            v-model.trim="form.email"
            class="modal__input"
            type="email"
            placeholder="Почта"
          />

          <input
            v-model.trim="form.password"
            class="modal__input"
            type="password"
            placeholder="Пароль"
          />

          <input
            v-if="isSignUp"
            v-model.trim="form.confirmPassword"
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
const route = useRoute();
const router = useRouter();
const isSignUp = computed(() => route.path.includes("signup"));

const form = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  const fields = {
    email: "Почта",
    password: "Пароль",
    confirmPassword: "Повторите пароль"
  };

  // Проверка пустых полей
  const requiredFields = isSignUp.value 
    ? ["email", "password", "confirmPassword"]
    : ["email", "password"];

  for (const field of requiredFields) {
    if (!form[field].trim()) {
      handleError(400, `Поле "${fields[field]}" обязательно для заполнения`);
      return false;
    }
  }

  // Проверка формата email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    handleError(400, "Введите корректный email адрес");
    return false;
  }

  // Проверка совпадения паролей
  if (isSignUp.value && form.password !== form.confirmPassword) {
    handleError(400, "Пароли не совпадают");
    return false;
  }

  return true;
};

const handleError = (statusCode, message) => {
  router.push({
    path: "/error",
    query: {
      statusCode,
      message,
      from: route.path,
      showBack: true
    }
  });
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    // Здесь будет вызов API
    console.log("Форма валидна, данные:", form);
    
    // Сброс формы после успешной отправки
    Object.keys(form).forEach(key => form[key] = "");
    
  } catch (err) {
    handleError(
      err.response?.status || 500,
      err.response?.data?.message || "Ошибка сервера"
    );
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