import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 站點
const path = 'ymiee'; // 個人 API Path

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    //發送 API 至遠端並登入 (並儲存 token )
    login() {
      axios.post(`${url}/admin/signin`, this.user)
      .then((res) => {
        // token 鑰匙 ， expired 使用期限
        const { token, expired } = res.data;
        // 儲存至 cookie
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        window.location = 'products.html';
      })
      .catch((err) => {
        alert(err.data.message);
      });
    }
  },
  mounted() {

  }
});

app.mount('#app');