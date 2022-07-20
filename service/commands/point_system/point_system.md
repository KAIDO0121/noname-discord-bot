# For MOD

```bash
# 1 - 創建未來商城
/create_official_shop
# 2 - 創建官方商品
/create_official_product :role :amount
```

# For 使用者

```bash
# 3 - 從未來商城進貨商品
/income_product :official_product_id :amount
# 4 - 創建自己的商店
/create_shop
# 5 - 上架商品
/put_product :product :amount
# 6 - 下架商品
/down_product :product :amount
# 7 - 呼叫未來商城 or 指定 某 user 的商店
/check_shop :user

# 8 - 呼叫自己的商店
/my_shop
# 9 - 呼叫自己的背包
/my_item
# 10 - 購買商品
/buy :user :product_id :amount
# 11 - 使用商品
/use :product :amount
```


# MOD 測試流程
1. 創建未來商城 /create_official_shop
2. 創建官方商品 /create_official_product :role :amount

# 上架自己商品流程
1. 查看未來商城 /check_shop
2. 複製商品 id
3. 從未來商城進貨商品 /income_product :official_product_id :amount
4. 上架商品 /put_product :item :price

# 下架自己商品流程
1. 查看自己的商店 /my_shop
2. 下架商品 /down_product :item :amount

# 購買商品流程
1. 查看別人商店 /check_shop :user
2. 購買商品 /buy :user :item :amount

# 使用商品流程
1. 呼叫自己的背包 /my_item
2. 使用商品 /use :item






# 檢查冗餘