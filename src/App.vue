<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
       
    </div>
</template>

<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
<script >
	export default{
		name:'app',
		provide(){
			return{
				reload:this.reload
			}
			
		},
		data(){
			return {
			isRouterAlive:true
		}
		},
	
	methods:{
		reload(){
			this.isRouterAlive=false
			this.$nextTick(function(){
				this.isRouterAlive=true
			})
		}
	}
}
</script>