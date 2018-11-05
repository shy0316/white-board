<template>
  <div class="white-board-sidebar" :class="[isShow ? '':'white-board-sidebar-indent']">
    <div class="images-list-icon-container" @click="handleImageListsShow"> 
      <div class="images-list-icon-area">
        <img
          class="images-list-icon" 
          :src="isShow ? leftIcon: rightIcon ">
      </div>
    </div>
    <div v-show="isShow" class="white-board-images-list">
      <div class="board-images-list-content" v-if="imgGroupLists.length > 0">
        <div 
          class="white-board-images-list-item" 
          v-for="(imageGroup,idx) in imgGroupLists"
          :key="idx">
          <div class="board-list-item-time">{{ imageGroup.time }}</div>
          <div class="board-list-item-title">{{ imageGroup.name }}</div>
          <div class="board-list-item-btns">
            <Button 
              class="board-list-item-btn-item"
              type="primary"
              @click="handleUseClick(imageGroup,idx)">{{ $t('whiteBoard.look') }}</Button>
            <Button
              class="board-list-item-btn-item btn-ghost" 
              type="primary" 
              @click="downloadPics(imageGroup.id)">{{ $t('whiteBoard.download') }}</Button>
            <Button
              @click="comfirmDelete(imageGroup.id)" 
              type="error" 
              class="board-list-item-btn-item btn-ghost">{{ $t('whiteBoard.remove') }}</Button>
          </div>
        </div>
      </div>
      <div class="white-board-empty-container" v-else>
        {{ $t('whiteBoard.noPicsGroup') }}
      </div>
      <div class="board-images-list-footer">
        <Button 
          class="white-board-upload-btn"
          @click="changeImageUploadModalShow(true)">{{ $t('whiteBoard.uploadPics') }}</Button>
      </div>
      <image-upload-modal
        :id="extId"
        v-model="uploadModalShow" 
        @on-refresh-pic-group-list="handleRefreshList"
        @on-image-upload-modal-change="changeImageUploadModalShow(false)"/>
    </div>
  </div>
</template>

<script>
  import imageUploadModal from '../image-upload-modal/imageUploadModal.vue'
  import {getPicsGroup,deletePicsGroup,downloadPicsGroup} from '../../services/index.js'
  const TAG = 'white-board/WhiteBoardImageList'
  export default {
    components: {
      imageUploadModal,
    },
    props: {
      extId: {
        type: Number,
        default () {
          return -999
        }
      },
      isShow : {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    watch:{
      extId () {
        this.getPicsGroupList()
      }
    },
    created () {
      this.getPicsGroupList()
    },
    data () {
      return {
        uploadModalShow: false,
        imgGroupLists: [],
        leftIcon: require('../../static/images/arrow-left.svg'),
        rightIcon: require('../../static/images/arrow-right.svg'),
      }
    },
    methods: {
      handleRefreshList () {
        this.getPicsGroupList ()
        this.$emit('on-refresh-img-list')
      },
      handleImageListsShow () {
        this.$emit('on-image-list-show',!this.isShow)
      },
      async getPicsGroupList () {
        try {
          let res =  await getPicsGroup(this.extId,1,1000)
          if(res instanceof Array) {
            this.imgGroupLists = res
          }else {
            this.imgGroupLists = []
          }
          this.$emit('on-save-group-list',this.imgGroupLists) 
        }catch(e) {
          console.log(TAG,'getPicsGroupList',e.msg)
        }
      },  
      async handleUseClick (imageGroup,idx) {
        this.$emit('on-image-change', {'imageGroup':imageGroup,'idx':idx})
      },
      async downloadPics (id) {
        try {
          let res = await downloadPicsGroup(id)
          if(res) {
            this.download(res)
          }
        }catch(e) {
          console.log(TAG,'downloadPics',e.msg)
        }
      },
      download (url) {
        let tempForm = document.createElement('form')
        document.body.appendChild(tempForm)
        tempForm.method = 'get'
        tempForm.setAttribute('display','none')
        tempForm.action = url
        tempForm.submit()
      },
      comfirmDelete (id) {
        let vm = this
        vm.$Modal.confirm({
          title: vm.$t('whiteBoard.picGroup'),
          content: vm.$t('whiteBoard.clearPicGroupTip'),
          onOk: async () => {
            vm.deletePicGroup(id)
          },
        })
      },
      async deletePicGroup (id) {
        let vm = this
        try {
          let res = await deletePicsGroup(id)
          if(res== 'success') {
            vm.getPicsGroupList()
          }
        }catch (e) {
          console.log(TAG,'deletePicGroup',e.msg)
        }
      },
      changeImageUploadModalShow (value) {
        this.$set(this,'uploadModalShow',value)
      }
    }
  }
</script>
<style scoped>
  .white-board-sidebar {
    width: 240px;
    height: 100%;
    background: #F8F8F9;
    position: relative;
    display:flex;
  }

  .white-board-sidebar-indent {
    width: 20px;
    background: #fff;
  } 

  .white-board-images-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    height: 100%;
    width: 220px;
  }

   .images-list-icon-container {
    left: 0px;
    background: #fff;
    width: 20px;
    height: 100%;
    padding-top: 20px;
  }

  .images-list-icon-area {
    background: #F8F8F9;
    height: 30px;
    width: 20px;
    display: flex;
    align-items: center;
  }

  .images-list-icon {
    width: 20px;
    height: 20px;
  }

  .board-images-list-content {
    width: 100%;
    height: calc(100% - 42px);
    overflow: hidden scroll;
}

  .flex-column-center {
    align-items: center;
    justify-content: center;
  }

  .white-board-images-list-item {
     background: #fff;
     padding: 5px 10px;
     display: flex;
     flex-direction: column;
     margin: 15px 0px;
     box-shadow: 2px 2px 4px 4px #f1f1f4;
  }

  .board-list-item-time {
    font-size: 12px;
    color:#101010;
    line-height: 18px;
    opacity: 0.45;
  }

  .board-list-item-title {
    font-size: 14px;
    color:#101010;
    line-height: 20px;
  }

  .board-list-item-btns {
    display: flex;
    margin: 0px -2%;
  }

  .board-list-item-btn-item{
    margin: 5px 2%;
    height: 24px;
    width: 30%;
    line-height: 12px;
    font-size: 12px;
  }

  .btn-ghost {
    background: #fff;
  }

  .btn-ghost.ivu-btn-error {
    color: #ed4014;
  }

  .btn-ghost.ivu-btn-primary {
    color: #2d8cf0;
  }

  .btn-ghost:hover {
    background: rgba(245, 249, 254, .5)
  }

  .board-images-list-footer {
    width: 90%;
    margin-top: 8px;
  }

  .white-board-upload-btn {
    width: 100%;
    background: #fff;
  }

  .white-board-empty-container {
    width:100%;
    display: flex;
    height: calc(100% - 42px);
    align-items: center;
    justify-content: center;
  }
</style>
