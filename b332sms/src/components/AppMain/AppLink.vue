<template>
 <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: $route.path }" class="line">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped>
.el-breadcrumb{
        height: 10px;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }
    .line{
        border-left: 3px solid #31c17b;
        padding-left: 10px;
    }
</style>