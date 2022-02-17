import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

let delProductModal = null;
let productModal = null;

const app = createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      api_Path: 'ymiee',
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
      axios.post(`${this.url}/api/user/check`)
      .then((res) => {
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
      axios.get(`${this.url}/api/${this.api_Path}/admin/products`)
      .then((res) => {
        const { products } = res.data;
        this.products = products;
      })
      .catch((err) => {
        alert(err.data.message);        
      })
    },
    // 啟用/未啟用
    toggleEnabled(id) {
      this.products.forEach((item, index, arr) => {
        if(item.id == id) {
          this.products[index].is_enabled = !item.is_enabled 
        }
      })
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
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';
    
      // 根據 isNew 來判斷要串接 post 或是 put API
      if (!this.isNew) {
        // 編輯狀態
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }    
      // post 和 put 使用參數相同，成功後的行為相同（函式架構相同），所以合併
      axios[http](api, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message); 
          productModal.hide();
          this.getProductsData();
        }).catch((err) => {
          alert(err.data.message);
        })    
    },
    //  刪除產品
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getProductsData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    // 新增圖片
    addImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },     
});

app.mount('#app');




