<template>
  <div class="wrap">
    <!--工具栏-->
    <el-row>
      <el-button type="primary" size="small" @click="addField()">新增</el-button>
      <el-button type="primary" size="small" @click="updateField()">修改</el-button>
      <el-button type="primary" size="small" @click="deleteField()">删除</el-button>
    </el-row>
    <br/>


    <!--表格-->
    <el-table  :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
               @selection-change="handleSelectionChange" border style="width: 100%"
               :default-sort = "{prop: 'sortNum', order: 'descending'}">
      <!--表头结束-->

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="fieldNo" label="字段名称" width="180"></el-table-column>
      <el-table-column prop="fieldName" label="中文显示"></el-table-column>
      <el-table-column prop="isShow" label="是否显示"></el-table-column>
      <el-table-column prop="fieldType" label="字段类型"></el-table-column>
      <el-table-column prop="cosSpan" label="占格数"></el-table-column>
      <el-table-column prop="sortNum" label="排序"></el-table-column>
    </el-table>

    <br/>
    <!--分页-->
    <el-pagination background layout="total,prev, pager, next"
                   :page-size="pagesize"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :total="tableData.length" style="float: right;">
    </el-pagination>


    <!--新增弹框-->
    <!-- <el-dialog title="" :visible.sync="dialogVisible" width="50%">
      <el-form ref="fieldAdd" :model="fieldAdd" label-width="80px" size="small">
        <el-form-item label="字段名称:">
          <el-input v-model="fieldAdd.fieldNo"></el-input>
        </el-form-item>
        <el-form-item label="中文显示:">
          <el-input v-model="fieldAdd.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:">
          <el-input v-model="fieldAdd.isShow"></el-input>
        </el-form-item>
        <el-form-item label="字段类型:">
          <el-input v-model="fieldAdd.fieldType"></el-input>
        </el-form-item>
        <el-form-item label="占格数:">
          <el-input v-model="fieldAdd.cosSpan"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="crmCustomerFieldSave('fieldAdd')">确 定</el-button>
        </span>
    </el-dialog> -->
    <el-dialog title="" :visible.sync="dialogVisible" width="50%" @close="dlgClose('crmMarketingClueFieldAdd')">
      <el-form ref="crmMarketingClueFieldAdd" :model="crmMarketingClueFieldAdd" :rules="field_rules" label-position="left" label-width="120px" size="small">
        <el-form-item label="字段名称:" prop="fieldNo">
          <el-input   :disabled="true" v-model="crmMarketingClueFieldAdd.fieldNo"></el-input>
        </el-form-item>
        <el-form-item label="中文显示:" prop="fieldName">
          <el-input v-model="crmMarketingClueFieldAdd.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="是否显示:" prop="isShow">
          <el-select v-model="crmMarketingClueFieldAdd.isShow"  placeholder="请选择">
            <el-option
              v-for="item in true_or_false"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型:" prop="fieldType">
          <el-select v-model="crmMarketingClueFieldAdd.fieldType"  placeholder="请选择">
            <el-option
              v-for="item in field_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典名:" prop="dictName">
          <el-input v-model="crmMarketingClueFieldAdd.dictName"></el-input>
        </el-form-item>
        <el-form-item label="占格数:" prop="cosSpan">
          <el-input v-model="crmMarketingClueFieldAdd.cosSpan"></el-input>
        </el-form-item>
        <el-form-item v-show="false" label="主键:" prop="id">
          <el-input   :disabled="true" v-model="crmMarketingClueFieldAdd.id"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="sortNum">
          <el-input v-model="crmMarketingClueFieldAdd.sortNum"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="crmMarketingClueFieldSave('crmMarketingClueFieldAdd')">确 定</el-button>
        </span>
    </el-dialog>



  </div>




</template>

<script src="../js/marketing_clue_field.js">

</script>
<style lang="less" scoped>
</style>
