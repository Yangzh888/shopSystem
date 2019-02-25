<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 数据分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商铺总括" name="first" >
                <el-row>
                    <el-col :span="1"> &nbsp;</el-col>
                    <el-col :span="10"> 
                        <el-card :body-style="{ padding: '0px' }" style="background:#E4E7ED">
                            <div slot="header" class="clearfix" style="text-align: center;font-size: 18px;color: red;font-weight: bold;">
                                <span >关于钱</span>
                            </div>
                            <div style="padding: 5px;">
                                <p style="text-align: center;color: #303133;font-size: 24px; padding: 4px">
                                  目前商品总价值：  <span style=" font-weight: bold; color: red"> {{shop.allTradeTotal}}元</span>

                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 4px">
                                    目前商品预期利润：<span style=" font-weight: bold; color: black">{{shop.allTradeProfitTotal}}元</span>
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 8px">
                                    已出售商品 赚取金额：<span style=" font-weight: bold; color: black">{{shop.tradeGetProfitTotal}}元</span>
                                </p>
                                <div class=" bottom clearfix">
                                </div>
                            </div>
                        </el-card>
                        <p>&nbsp;</p>
                           <ve-histogram :data="aboutMoneychartData"></ve-histogram>
                    </el-col><el-col :span="2"> &nbsp;</el-col>
                    <el-col :span="10">
                        <el-card :body-style="{ padding: '0px' }" style="background:#E4E7ED">
                            <div slot="header" class="clearfix" style="text-align: center;font-size: 18px;color: red;font-weight: bold;">
                                <span >关于物品</span>
                            </div>
                            <div style="padding: 5px;">
                                <p style="text-align: center;color: #303133;font-size: 24px; padding: 4px">
                                    商品总数量： {{shop.allTradeNumber}}个
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 4px">
                                  所有订单数量：  <span style=" font-weight: bold; color: red"> {{shop.budgetNumber}}个</span>
                                </p>
                                <p style="text-align: center; color: #606266;font-size: 18px; padding: 8px">
                                    已有客户数量：<span style=" font-weight: bold; color: black">{{shop.allwholesalerNumber}}个</span>
                                </p>
                                <div class=" bottom clearfix">
                                </div>
                            </div>
                        </el-card>

                           <ve-histogram :data="aboutGoodschartData"></ve-histogram>
                    </el-col>
                    <el-col :span="1"></el-col>
                </el-row>
              
            </el-tab-pane>
           
          
        </el-tabs>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.getShopInfo();

    },
    data() {
        return {
            shop: {},
            activeName: 'first',
            userId: localStorage.getItem('userId'),

          aboutMoneychartData: {
          columns: ['label', '值', ],
          rows: []
        },
         aboutGoodschartData: {
          columns: ['label', '值', ],
          rows: []
        },

        }
    },
    methods: {

        /*获取商品信息*/
        getShopInfo() {

            this
                .$axios
                .post('/budget/getShopInfo', {
                    userId: this.userId,
                })
                .then((response) => {
                    this.aboutMoneychartData.rows = response.data.aboutMoney
                    this.aboutGoodschartData.rows = response.data.aboutGoods
                     this.shop = response.data.shopInfoMap

                })
                .catch(function(error) {}.bind(this));

        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

</script>
<style>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
}

</style>
