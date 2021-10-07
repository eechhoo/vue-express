<template>
 <div>
     <!-- 头部区域 -->
     <app-header></app-header>
     <!-- 左侧导航栏 -->
     <app-navbar></app-navbar>
     <!-- 主体区域 -->
     <app-main></app-main>
     
     
 </div>
</template>

<script>
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'
export default {
 data () {
 return {
 }
 },

 components: {
     AppHeader,
     AppNavbar,
     AppMain
 },

 methods: {}
}
</script>

<style scoped>
    .header{
        position: absolute;
        line-height: 51px;
        padding: 0;
        top: 0;
        left: 0;
        right: 0;
        background-color: #2d3a4b;
    }
    .navbar{
        position: absolute;
        width: 230px;
        top: 50px;
        left: 0;
        bottom: 0;
        overflow-y: auto;
        background-color: #545c64;
    }
    .main{
        position: absolute;
        top: 50px;
        left: 230px;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        padding: 10px;
    }
</style>