<template>
  <div class="white-board-image-upload">
    <Modal
      v-model="isShow"
      :title="$t('whiteBoard.uploadPics')"
      @on-cancel="cancel">
      <Form 
        :label-width="100"
        label-position="left"
        ref="imageForm"
        :model="imageForm"
        :rules="imageFormRules">
        <FormItem prop="name" :label="$t('whiteBoard.picsGroupName')">
          <i-input
            style="width: 80%"
            type="text"
            v-model="imageForm.name"
            :placeholder="$t('whiteBoard.inputPicGroupNameTip')" />
        </FormItem>
        <FormItem prop="pic" :label="$t('whiteBoard.uploadPics')">
          <Upload
            ref="boardUpload"
            :data="whiteBoardImageUploadData"
            multiple
            :on-success="handleSuccess"
            :action="whiteBoardImageUploadUrl">
            <Button type="ghost" icon="ios-cloud-upload-outline">{{ $t('whiteBoard.uploadPics') }}</Button>
          </Upload>
        </FormItem>
      </Form>
      <div
        slot="footer">
        <Button
          type="ghost"
          @click="cancel">{{ $t('whiteBoard.cancle') }}</Button>
        <Button
          type="primary"
          :loading="loading"
          @click="uploadImages">{{ $t('whiteBoard.sure') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {addPicsGroup} from '../../services/index.js'
  import store from '../../common/store'
  const TAG = 'white-board/imageUploadModal'
  export default {
    props: {
      value : {
        type: Boolean,
        default () {
          return false
        }
      },
      id: {
        type: Number,
        default () {
          return -999
        }
      }
    },
    computed: {
      loginInfo () {
        return store.store('loginInfo')
      },
      whiteBoardImageUploadData () {
        let channel = this.loginInfo.channel
        let appkey = this.loginInfo.appkey
        return {
          channel: channel,
          appkey: appkey
        }
      }
    },
    data () {
      const picValidate = (rule, value, callback) => {
        if(value && value instanceof Array) {
          callback()
        }else {
          callback(new Error(this.$t('whiteBoard.uploadPicTip')))
        }
      }
      return {
        loading: false,
        whiteBoardImageUploadUrl:this.$wbconfig.uploadDomain+'/Upload/doUploadPicture',
        isShow: false,
        imageForm: {
          name: '',
          pic: []
        },
        imageFormRules: {
          name: [
            {required: true,message: this.$t('whiteBoard.inputPicGroupNameTip')}
          ],
          pic: [
            {required: true, validator: picValidate}
          ]
        },
      }
    },
    watch:{
      value () {
        this.isShow = this.value
        if(this.value) {
          this.reset()
        }
      },
    },
    methods: {
      reset () {
        this.imageForm.pic = []
        this.imageForm.name = ''
        this.$refs.imageForm.resetFields()
        this.$refs.boardUpload.clearFiles()
      },
      handleSuccess (res,file,filelist) {
        let vm = this
        vm.imageForm.pic.push({
          name: file.name,
          url: file.response.url,
        })
      },
      uploadImages () {
        let vm = this
        this.$refs.imageForm.validate((valid) => {
          if(valid) {
            vm.addPics()
          }else {
            return false
          }
        })
      },
      async addPics () {
        this.loading = true
        try {
          let res = await addPicsGroup(
            this.loginInfo.accountId,
            this.id,
            this.imageForm.name,
            this.imageForm.pic)
          this.loading = false  
          if(res) {
            this.$emit('on-refresh-pic-group-list')
            this.$emit('on-image-upload-modal-change')
          }
        }catch(e) {
          this.loading = false 
          console.log(TAG,'addPics',e.msg)
        }
      },
      cancel () {
        this.$emit('on-image-upload-modal-change')
        this.reset()
      }
    }
  }
</script>
<style scoped>
  
</style>
