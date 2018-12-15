<template>
  <div class="wrap">

    <!--查询表单-->
    <el-form label-position="left" size="small" :inline="true" :model="dsQuery" label-width='70px' class="query-form">
      <el-form-item label="客户名称">
        <el-input v-model="dsQuery.name" clearable placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getCustomers(1)">查询</el-button>
        <el-button type="primary" @click="clearQuery">清空</el-button>
      </el-form-item>
      <el-form-item>
        &nbsp;&nbsp;&nbsp;&nbsp;<a class="text-base" @click='query_show = !query_show; '>更多查询条件<i :class="'iconfont icon-'+query_show"></i></a>
      </el-form-item>
      <div v-show="query_show">
        <div class="input-box">
          <el-form-item label="拥有者">
            <el-input v-model="dsQuery.own" clearable placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="客户类型">
            <el-select v-model="dsQuery.type" clearable placeholder="请选择">
              <el-option
                v-for="item in khlx"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进状态">
            <el-select v-model="dsQuery.state" clearable placeholder="请选择">
              <el-option
                v-for="item in gjzt"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="input-box">
          <el-form-item label="电话">
            <el-input v-model="dsQuery.phone" clearable placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="dsQuery.classify" clearable placeholder="请选择">
              <el-option value="1" label="我拥有的"></el-option>
              <el-option value="2" label="我参与的"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进时间">
              <el-date-picker
                  v-model="dsQuery.follow_time"
                  type="daterange"
                  style="width: 250px; margin-right: 30px;"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="创建时间">
              <el-date-picker
                  v-model="dsQuery.create_time"
                  type="daterange"
                  style="width: 250px; margin-right: 30px;"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <!--操作按钮-->
    <el-row>
      <el-button type="primary" size="small" @click="addCrmCustomer">新增</el-button>
      <el-button type="primary" size="small" @click="deleteCrmCustomer">删除</el-button>
      <el-button type="primary" size="small" @click="mergeClient">合并</el-button>
      <el-button type="primary" size="small" @click="turnOther">转给他人</el-button>
      <el-button type="primary" size="small" @click="importExcel">导入</el-button>
      <input type="file" ref="uploadExcel" v-show="false" accept=".xls,.xlsx" @change="readExcel">
    </el-row>

    <!--客户表格数据展示-->
    <el-table class="table" ref="table" :data="tableData1"
              max-height="500" border style="width: 100%; margin-top: 20px;"
              @selection-change="handleSelectionChange" @sort-change="sortChange"
            >
      <el-table-column :reserve-selection='true' type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="客户名称" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link class="text-base" :to="'./client_detail?id=' + scope.row.id">{{scope.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="ownerCname" sortable="custom" label="拥有者"></el-table-column>
      <el-table-column prop="cusType" sortable label="客户类型"></el-table-column>
      <el-table-column prop="cusSize" sortable="custom" label="客户规模"></el-table-column>
      <el-table-column prop="industry" sortable="custom" label="所属行业"></el-table-column>
      <el-table-column prop="phone" sortable="custom" label="电话"></el-table-column>
      <el-table-column prop="followStatus" sortable="custom" label="跟进状态"></el-table-column>
      <el-table-column prop="lastFollowTime" sortable="custom" label="最近跟进时间" min-width="90"></el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime.split(' ')[0]}}
        </template>
      </el-table-column>
    </el-table>


    <!--客户表格数据分页-->
    <el-pagination v-if="count" background layout="total,prev, pager, next"
                   :page-size="pageSize"
                   @current-change="getCustomers"
                   :current-page="currentPage"
                   :total="count" style="float: right;">
    </el-pagination>
    <!--新增客户弹框-->
    <el-dialog title="新增客户" width="600px" @close="closeAdd" class="dialogAdd"
               :visible.sync="dialogAddVisible" :close-on-click-modal='false'>
      <el-form ref="customerAdd" :rules="customer_rules" :model="customerAdd" label-position="left" label-width="120px" size="small">

        <el-form-item v-for="(item,index) in customerAddLabel" :key="index" :label="item.label" :prop="item.name">

          <el-input v-if="item.editorType == 'text'" :prop="item.name" v-model="customerAdd[item.name]"></el-input>
          <!-- <el-date-picker v-if="item.editorType == 'date'" v-model="customerAdd[item.name]" type="date"
                          value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker> -->
          <el-date-picker v-if="item.editorType == 'date'" v-model="customerAdd[item.name]" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"
            type="datetime" placeholder="选择日期时间">
          </el-date-picker>

          <el-select v-if="item.editorType == 'dict'" v-model="customerAdd[item.name]">
            <el-option
              v-if="item.editorType == 'dict'"
              v-for="value in item.selectList"
              :key="value"
              :label="value"
              :value="value">
            </el-option>
          </el-select>
          <el-cascader
            v-if="item.editorType == 'cascade'"
            size="small"
            :options="cityData()"
            v-model="customerAdd[item.name]">
          </el-cascader>
        </el-form-item>
        <el-form-item  label="拥有者" prop="ownerCname">
          <el-select v-model="customerAdd.ownerCname" size="small" filterable clearable placeholder="请输入客户名称">
            <el-option
              v-for="item in allStaff"
              :key="item.userName"
              :label="item.cname + '   ' + item.userName"
              :value="item.cname + '/' + item.userName">
              <span style="float: left; width: 100px;">{{ item.cname }}</span>
              <span style="color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="customerSava('customerAdd')">确 定</el-button>
      </div>

    </el-dialog>


    <!--转给他人弹框-->
    <el-dialog title="转给他人" width="40%" :visible.sync="dialogTransferVisible" @open="openTurnModal" :close-on-click-modal='false'>
      <el-form ref="form" :model="formTransfer" label-width="120px" size="small">
        <el-form-item label="新拥有者">
          <el-form-item>
              <el-select v-model="staff" size="small" filterable clearable placeholder="请输入员工姓名或工号">
                  <el-option
                      v-for="item in allStaff"
                      :key="item.userName"
                      :label="item.cname + '  ' + item.userName"
                      :value="item.userName">
                      <span style="float: left">{{ item.cname }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                  </el-option>
              </el-select>
          </el-form-item>
          <el-checkbox v-model="formTransfer.checkbox1">保留原拥有者为团队成员</el-checkbox>
        </el-form-item>
        <el-form-item label="转移相关业务">
          <el-checkbox v-model="formTransfer.checkbox2">线索</el-checkbox>
          <el-checkbox v-model="formTransfer.checkbox3">机会</el-checkbox>
          <el-checkbox v-model="formTransfer.checkbox4">合同</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTransferVisible = false">取 消</el-button>
        <el-button type="primary" @click="turn_other_sava">确 定</el-button>
      </div>
    </el-dialog>

    <!--合并客户弹框-->
    <el-dialog title="合并客户" width="600px" :visible.sync="dialogMergeVisible" :close-on-click-modal='false'>
      <table>
        <tr>
          <td valign='top' width='50'>提示：</td>
          <td>
            <p>1、合并后只保留目标客户，将另一个客户的联系人、机会、合同、附件等迁移到目标客户。</p>
            <p>2、请选择要在合并后的记录中保留的值，突出显示的行表明字段中包含冲突数据。</p>
            <p>3、合并后的记录中将保留最早的创建日期。</p>
          </td>
        </tr>
      </table>
      <table width='100%' cellspacing='1' cellpadding='1' bgcolor='#ddd' border="0" class="mergeTable">
        <tr>
          <td style="background: #ccc;">主记录</td>
          <td style="background: #ccc;">
            <el-radio v-if="mergeClient1.field_must_name != mergeClient2.field_must_name" v-model="formMerge.field_must_name" @change="chooseMianMerge('mergeClient1', 'mergeClient2')" :label="mergeClient1.field_must_name">{{mergeClient1.field_must_name}}</el-radio>
          </td>
          <td style="background: #ccc;">
            <el-radio v-if="mergeClient1.field_must_name != mergeClient2.field_must_name" v-model="formMerge.field_must_name" @change="chooseMianMerge('mergeClient2', 'mergeClient1')" :label="mergeClient2.field_must_name">{{mergeClient2.field_must_name}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>电话</td>
          <td>
            <span v-if="mergeClient1.field_must_phone == mergeClient2.field_must_phone">{{formMerge.field_must_phone}}</span>
            <el-radio v-if="mergeClient1.field_must_phone != mergeClient2.field_must_phone" v-model="formMerge.field_must_phone" :label="mergeClient1.field_must_phone">{{mergeClient1.field_must_phone}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_phone == mergeClient2.field_must_phone">{{formMerge.field_must_phone}}</span>
            <el-radio v-if="mergeClient1.field_must_phone != mergeClient2.field_must_phone" v-model="formMerge.field_must_phone" :label="mergeClient2.field_must_phone">{{mergeClient2.field_must_phone}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td>
            <span v-if="mergeClient1.field_must_mail == mergeClient2.field_must_mail">{{formMerge.field_must_mail}}</span>
            <el-radio v-if="mergeClient1.field_must_mail != mergeClient2.field_must_mail" v-model="formMerge.field_must_mail" :label="mergeClient1.field_must_mail">{{mergeClient1.field_must_mail}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_mail == mergeClient2.field_must_mail">{{formMerge.field_must_mail}}</span>
            <el-radio v-if="mergeClient1.field_must_mail != mergeClient2.field_must_mail" v-model="formMerge.field_must_mail" :label="mergeClient2.field_must_mail">{{mergeClient2.field_must_mail}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>传真</td>
          <td>
            <span v-if="mergeClient1.field_must_fax == mergeClient2.field_must_fax">{{formMerge.field_must_fax}}</span>
            <el-radio v-if="mergeClient1.field_must_fax != mergeClient2.field_must_fax" v-model="formMerge.field_must_fax" :label="mergeClient1.field_must_fax">{{mergeClient1.field_must_fax}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_fax == mergeClient2.field_must_fax">{{formMerge.field_must_fax}}</span>
            <el-radio v-if="mergeClient1.field_must_fax != mergeClient2.field_must_fax" v-model="formMerge.field_must_fax" :label="mergeClient2.field_must_fax">{{mergeClient2.field_must_fax}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>地区</td>
          <td>
            <span v-if="mergeClient1.field_must_area == mergeClient2.field_must_area">{{formMerge.field_must_area}}</span>
            <el-radio v-if="mergeClient1.field_must_area != mergeClient2.field_must_area" v-model="formMerge.field_must_area" :label="mergeClient1.field_must_area">{{mergeClient1.field_must_area}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_area == mergeClient2.field_must_area">{{formMerge.field_must_area}}</span>
            <el-radio v-if="mergeClient1.field_must_area != mergeClient2.field_must_area" v-model="formMerge.field_must_area" :label="mergeClient2.field_must_area">{{mergeClient2.field_must_area}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>公司地址</td>
          <td>
            <span v-if="mergeClient1.field_must_org_address == mergeClient2.field_must_org_address">{{formMerge.field_must_org_address}}</span>
            <el-radio v-if="mergeClient1.field_must_org_address != mergeClient2.field_must_org_address" v-model="formMerge.field_must_org_address" :label="mergeClient1.field_must_org_address">{{mergeClient1.field_must_org_address}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_org_address == mergeClient2.field_must_org_address">{{formMerge.field_must_org_address}}</span>
            <el-radio v-if="mergeClient1.field_must_org_address != mergeClient2.field_must_org_address" v-model="formMerge.field_must_org_address" :label="mergeClient2.field_must_org_address">{{mergeClient2.field_must_org_address}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>邮编</td>
          <td>
            <span v-if="mergeClient1.field_must_youbian == mergeClient2.field_must_youbian">{{formMerge.field_must_youbian}}</span>
            <el-radio v-if="mergeClient1.field_must_youbian != mergeClient2.field_must_youbian" v-model="formMerge.field_must_youbian" :label="mergeClient1.field_must_youbian">{{mergeClient1.field_must_youbian}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_youbian == mergeClient2.field_must_youbian">{{formMerge.field_must_youbian}}</span>
            <el-radio v-if="mergeClient1.field_must_youbian != mergeClient2.field_must_youbian" v-model="formMerge.field_must_youbian" :label="mergeClient2.field_must_youbian">{{mergeClient2.field_must_youbian}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>客户来源</td>
          <td>
            <span v-if="mergeClient1.field_must_cus_source == mergeClient2.field_must_cus_source">{{formMerge.field_must_cus_source}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_source != mergeClient2.field_must_cus_source" v-model="formMerge.field_must_cus_source" :label="mergeClient1.field_must_cus_source">{{mergeClient1.field_must_cus_source}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_cus_source == mergeClient2.field_must_cus_source">{{formMerge.field_must_cus_source}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_source != mergeClient2.field_must_cus_source" v-model="formMerge.field_must_cus_source" :label="mergeClient2.field_must_cus_source">{{mergeClient2.field_must_cus_source}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>客户类型</td>
          <td>
            <span v-if="mergeClient1.field_must_cus_type == mergeClient2.field_must_cus_type">{{formMerge.field_must_cus_type}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_type != mergeClient2.field_must_cus_type" v-model="formMerge.field_must_cus_type" :label="mergeClient1.field_must_cus_type">{{mergeClient1.field_must_cus_type}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_cus_type == mergeClient2.field_must_cus_type">{{formMerge.field_must_cus_type}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_type != mergeClient2.field_must_cus_type" v-model="formMerge.field_must_cus_type" :label="mergeClient2.field_must_cus_type">{{mergeClient2.field_must_cus_type}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>所属行业</td>
          <td>
            <span v-if="mergeClient1.field_must_industry == mergeClient2.field_must_industry">{{formMerge.field_must_industry}}</span>
            <el-radio v-if="mergeClient1.field_must_industry != mergeClient2.field_must_industry" v-model="formMerge.field_must_industry" :label="mergeClient1.field_must_industry">{{mergeClient1.field_must_industry}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_industry == mergeClient2.field_must_industry">{{formMerge.field_must_industry}}</span>
            <el-radio v-if="mergeClient1.field_must_industry != mergeClient2.field_must_industry" v-model="formMerge.field_must_industry" :label="mergeClient2.field_must_industry">{{mergeClient2.field_must_industry}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>客户规模</td>
          <td>
            <span v-if="mergeClient1.field_must_cus_size == mergeClient2.field_must_cus_size">{{formMerge.field_must_cus_size}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_size != mergeClient2.field_must_cus_size" v-model="formMerge.field_must_cus_size" :label="mergeClient1.field_must_cus_size">{{mergeClient1.field_must_cus_size}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_cus_size == mergeClient2.field_must_cus_size">{{formMerge.field_must_cus_size}}</span>
            <el-radio v-if="mergeClient1.field_must_cus_size != mergeClient2.field_must_cus_size" v-model="formMerge.field_must_cus_size" :label="mergeClient2.field_must_cus_size">{{mergeClient2.field_must_cus_size}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>
            <span v-if="mergeClient1.field_must_remark == mergeClient2.field_must_remark">{{formMerge.field_must_remark}}</span>
            <el-radio v-if="mergeClient1.field_must_remark != mergeClient2.field_must_remark" v-model="formMerge.field_must_remark" :label="mergeClient1.field_must_remark">{{mergeClient1.field_must_remark}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_remark == mergeClient2.field_must_remark">{{formMerge.field_must_remark}}</span>
            <el-radio v-if="mergeClient1.field_must_remark != mergeClient2.field_must_remark" v-model="formMerge.field_must_remark" :label="mergeClient2.field_must_remark">{{mergeClient2.field_must_remark}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>所属部门</td>
          <td>
            <span v-if="mergeClient1.field_must_dept == mergeClient2.field_must_dept">{{formMerge.field_must_dept}}</span>
            <el-radio v-if="mergeClient1.field_must_dept != mergeClient2.field_must_dept" v-model="formMerge.field_must_dept" :label="mergeClient1.field_must_dept">{{mergeClient1.field_must_dept}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_dept == mergeClient2.field_must_dept">{{formMerge.field_must_dept}}</span>
            <el-radio v-if="mergeClient1.field_must_dept != mergeClient2.field_must_dept" v-model="formMerge.field_must_dept" :label="mergeClient2.field_must_dept">{{mergeClient2.field_must_dept}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>拥有者</td>
          <td>
            <span v-if="mergeClient1.field_must_own == mergeClient2.field_must_own">{{formMerge.field_must_own}}</span>
            <el-radio v-if="mergeClient1.field_must_own != mergeClient2.field_must_own" v-model="formMerge.field_must_own" :label="mergeClient1.field_must_own">{{mergeClient1.field_must_own}}</el-radio>
          </td>
          <td>
            <span v-if="mergeClient1.field_must_own == mergeClient2.field_must_own">{{formMerge.field_must_own}}</span>
            <el-radio v-if="mergeClient1.field_must_own != mergeClient2.field_must_own" v-model="formMerge.field_must_own" :label="mergeClient2.owner">{{mergeClient2.field_must_own}}</el-radio>
          </td>
        </tr>
        <tr>
          <td>创建日期</td>
          <td>
            <el-radio v-if="mergeClient1.field_must_creatTime != mergeClient2.field_must_creatTime" disabled v-model="formMerge.field_must_creatTime" :label="mergeClient1.field_must_creatTime">{{mergeClient1.field_must_creatTime}}</el-radio>
          </td>
          <td>
            <el-radio v-if="mergeClient1.field_must_creatTime != mergeClient2.field_must_creatTime" disabled v-model="formMerge.field_must_creatTime" :label="mergeClient2.field_must_creatTime">{{mergeClient2.field_must_creatTime}}</el-radio>
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMergeVisible = false">取 消</el-button>
        <el-button type="primary" @click="mergeSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--导入客户弹框-->
    <el-dialog title="导入" width="80%" :visible.sync="dialogImportVisible" :close-on-click-modal='false'>
      <!--导入数据展示-->
      <el-table class="table importTable" ref="importTable" :data="outputs" max-height="500" border style="width: 100%">
        <el-table-column width="30" type="index" label="序号" fixed></el-table-column>
        <el-table-column prop="name" label="客户名称" min-width="30">
          <template slot-scope="scope">
            <div :ref="scope.row.name?'' : 'importError'" :style="scope.row.name ? '' : 'color: red;'">{{ scope.row.name || '不能为空' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ownerCname" label="拥有者">
          <template slot-scope="scope">
            <div :ref="scope.row.ownerCname?'' : 'importError'" :style="scope.row.ownerCname ? '' : 'color: red;'">{{ (scope.row.ownerCname && scope.row.ownerCname.split("/")[1]) || '工号不存在' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" min-width="30"></el-table-column>
        <el-table-column prop="mail" label="邮箱" min-width="30"></el-table-column>
        <el-table-column prop="fax" label="传真" min-width="30"></el-table-column>
        <el-table-column prop="area" label="地区" min-width="30">
          <template slot-scope="scope" class="abc" min-width="30">
            <span>{{ scope.row.area.join("/") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="公司地址" min-width="30"></el-table-column>
        <el-table-column prop="zipCode" label="邮编" min-width="30"></el-table-column>
        <el-table-column prop="cusSource" label="客户来源" min-width="30"></el-table-column>
        <el-table-column prop="cusType" label="客户类型" min-width="30"></el-table-column>
        <el-table-column prop="industry" label="所属行业" min-width="30"></el-table-column>
        <el-table-column prop="cusSize" label="客户规模" min-width="30"></el-table-column>
        <el-table-column prop="followStatus" label="跟进状态" min-width="30"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">取 消</el-button>
        <el-button type="primary" @click="importSave">确 定</el-button>
      </div>
    </el-dialog>

    <dialog-check title="xxx公司" :dialogCheckVisible='dialogCheckVisible' :formCheck='formCheck' @closeDialog='closeCheckDialog($event)'></dialog-check>
  
  </div>
</template>

<script src="../js/client.js">

</script>

<style lang="less">
  @import '../style/client';
  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      .name {
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }
  .importTable{
    .el-table__header, .el-table__body{
      width: 900px !important;
    }
  }
</style>
