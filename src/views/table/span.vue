<template>
  <div class="app-container">
    <el-table
      :data="list"
      :span-method="objectSpanMethod"
      highlight-current-row
      border
      fit
    >
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="Name" prop="name" />
      <el-table-column align="center" label="Price" prop="price" />
      <el-table-column align="center" label="Brand" prop="brand" />
      <el-table-column align="center" label="Category" prop="category" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getListData"
    />
  </div>
</template>
<script>
import { mergeTableRow } from './utils'

import Pagination from '@/components/Pagination'

export default {
  name: 'SpanTable',

  components: { Pagination },

  data() {
    return {
      list: [],
      total: 0,

      listQuery: {
        page: 1,
        limit: 5
      },

      mockList: [
        { id: '0001', name: 'iPhone 11', price: 3000, brand: 'Apple', category: 'PHONE' },
        { id: '0001', name: 'iPhone 12', price: 4000, brand: 'Apple', category: 'PHONE' },
        { id: '0001', name: 'iPhone 13', price: 5000, brand: 'Apple', category: 'PHONE' },
        { id: '0001', name: 'iPhone 13 Pro', price: 8000, brand: 'Apple', category: 'PHONE' },
        { id: '0002', name: 'S20', price: 3300, brand: 'Samsung', category: 'PHONE' },
        { id: '0002', name: 'S21', price: 4400, brand: 'Samsung', category: 'PHONE' },
        { id: '0003', name: 'iPad Pro', price: 5000, brand: 'Apple', category: 'PAD' },
        { id: '0004', name: 'Pixel XL', price: 500, brand: 'Google', category: 'PHONE' },
        { id: '0004', name: 'Pixel 3', price: 1000, brand: 'Google', category: 'PHONE' },
        { id: '0004', name: 'Pixel 6 Pro', price: 6600, brand: 'Google', category: 'PHONE' },
        { id: '0005', name: 'Nexus 6P', price: 200, brand: 'Google', category: 'PHONE' },
        { id: '0006', name: 'MIX 4', price: 4000, brand: 'Xiaomi', category: 'PHONE' },
        { id: '0006', name: 'Xiaomi 12', price: 4000, brand: 'Xiaomi', category: 'PHONE' }
      ]
    }
  },

  created() {
    this.getListData()
  },

  methods: {
    getListData() {
      this.list = mergeTableRow({
        data: this.mockList,
        mergeColNames: ['id', 'brand'], // 需要合并的列，默认合并列相同的数据
        firstMergeColNames: ['id'], // 受影响的列，只合并以firstMerge为首的同类型数据
        firstMerge: 'id' // 以哪列为基础进行合并，一般为第一列
      })
      this.total = this.list.length
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const span = column['property'] + '-span'
      if (row[span]) {
        return row[span]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
