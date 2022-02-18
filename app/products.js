import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

const API_URL = 'https://vue3-course-api.hexschool.io/v2';
const API_PATH = 'ymiee';
let delProductModal = null;
let productModal = null;

const app = createApp({
  data() {
    return {
      products: [],
      isNew: false,
      itemTemp: {
        imagesUrl: []
      },      
    }
  },

  mounted() {    
    // 使用 new 建立 bootstrap Modal，拿到實體 DOM 並賦予到變數上
    // 新增 和 編輯共用 productModal
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false
    });
    // 刪除使用 delProductModal
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  },

  created() {
    // 取得 Token ( token 僅須設定一次)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
    // 預設將 token 自動加入至 headers
    axios.defaults.headers.common['Authorization'] = token;

    // 確認登入
    this.checkLogin();
  },

  methods: {
    // 確認是否登入
    checkLogin() {      
      axios.post(`${API_URL}/api/user/check`)
        .then(() => {
          // 取得產品資料
          this.getProductsData();
        })
        .catch((err) => {
          // 顯示錯誤訊息
          alert(err.data.message);
          // coolkie 不存在轉回登入頁面
          window.location = 'login.html';
        })
    },
    // 取得所有產品資料
    getProductsData() {
      axios.get(`${API_URL}/api/${API_PATH}/admin/products`)
        .then((res) => {
          const { products } = res.data;
          this.products = products;
        })
        .catch((err) => {
          alert(err.data.message);        
        })
    },
    // 啟用/未啟用
    toggleEnabled(item) {
      // 拷貝
      let newItem = { ...item };
      // 判斷改寫
      newItem.is_enabled = (item.is_enabled == 0 ? 1 : 0);
      this.itemTemp = newItem; 
      this.isNew = false;
      // 更新
      this.updateProduct();
    },
    
    //  開啟bs modal
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.itemTemp = { // 需要做清空物件的動作
          imagesUrl: [],
        };
        this.isNew = true; // 改變 isNew 的狀態
        productModal.show();
      } else if (isNew === 'edit') {
        this.itemTemp = { ...item }; 
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.itemTemp = { ...item };
        delProductModal.show()
      }
    },
    //  更新 或 新增  產品
    updateProduct() {
      let url = `${API_URL}/api/${API_PATH}/admin/product`;
      let method = 'post';
    
      // 根據 isNew 來判斷要串接 post 或是 put API
      if (!this.isNew) {
        // 編輯狀態
        url = `${API_URL}/api/${API_PATH}/admin/product/${this.itemTemp.id}`;
        method = 'put';
      }    
      // post 和 put 使用參數相同，成功後的行為相同（函式架構相同），所以合併
      axios[method](url, { data: this.itemTemp })
        .then((res) => {
          alert(res.data.message); 
          productModal.hide();
          this.getProductsData();
        }).catch((err) => {
          alert(err.data.message);
        })    
    },
    //  刪除產品
    delProduct() {
      const url = `${API_URL}/api/${API_PATH}/admin/product/${this.itemTemp.id}`;
      axios.delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getProductsData();
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    // 新增圖片
    addImages() {
      this.itemTemp.imagesUrl = [];
      this.itemTemp.imagesUrl.push('');
    },
  },     
});

app.mount('#app');




