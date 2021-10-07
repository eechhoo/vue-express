<template>
  <div>
    <!-- 条件查询控件 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="jobnumber">
        <el-input
          v-model="searchMap.jobnumber"
          placeholder="工号"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select
          v-model="searchMap.role"
          placeholder="教师职务"
          v-if="!isDialog"
        >
          <el-option
            v-for="option in roleOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="entrydate">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.entrydate"
          type="date"
          placeholder="入职时间"
          v-if="!isDialog"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd()"
          >新增</el-button
        >
        <el-button
          v-if="!isDialog"
          type="primary"
          @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table
      :data="list"
      height="400"
      border
      style="width: 100%"
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
    >
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="jobnumber" label="工号"> </el-table-column>
      <el-table-column prop="name" label="教师姓名"> </el-table-column>
      <el-table-column prop="role" label="教师职务" v-if="!isDialog">
        <template slot-scope="scope">
          <span>{{ scope.row.role | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="entrydate" label="入职时间" v-if="!isDialog">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column label="操作" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模板 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="
        !isDialog
          ? 'total, sizes, prev, pager, next, jumper'
          : ' prev, pager, next'
      "
      :total="total"
    >
    </el-pagination>

    <!-- 新增教师弹窗 -->
    <el-dialog title="教师编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="teacher"
        ref="teacherForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="工号" prop="jobnumber">
          <el-input v-model="teacher.jobnumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师姓名" prop="name">
          <el-input v-model="teacher.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="role">
          <el-select v-model="teacher.role" placeholder="请点击选择">
            <el-option
              v-for="option in roleOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="entrydate" label="入职时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="teacher.entrydate"
            type="date"
            placeholder="入职时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="teacher.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            teacher._id === null
              ? addData('teacherForm')
              : updateData('teacherForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from "@/api/teacher";
const roleOptions = [
  { type: "1", name: "教师" },
  { type: "2", name: "班主任" },
];
export default {
  data() {
    return {
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        jobnumber: "",
        name: "",
        role: "",
        entrydate: "",
      },
      dialogFormVisible: false,
      roleOptions,
      teacher: {
        _id: null,
        jobnumber: "",
        name: "",
        role: "",
        entrydate: "",
        phone: "",
      },
      rules: {
        jobnumber: [
          { required: true, message: "请输入教师工号", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入教师姓名", trigger: "blur" }],
      },
    };
  },
  props: {
    isDialog: false,
  },
  created() {
    this.fetchData();
  },
  components: {},
  filters: {
    roleFilter(type) {
      const obj = roleOptions.find(function (item) {
        if (item.type === type) {
          return item;
        }
      });
      return obj ? obj.name : null;
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      //   teacherApi.getList().then((response) => {
      //     const resp = response.data;

      //     this.list = resp.data.rows;
      //   });
      teacherApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
        });
    },
    handleEdit(id) {
      this.handleAdd();
      teacherApi.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.teacher = resp.data;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确定要删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          teacherApi.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["teacherForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.add(this.teacher).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teacherApi.update(this.teacher).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clickCurrentChange(currentRow){
      console.log(currentRow);
      this.$emit("option-teacher",currentRow)
    }
  },
};
</script>

<style scoped>
</style>


