<script lang="ts" setup>
import { ElMessage } from "element-plus"
import { ref } from "vue"
import { uploadImg } from "@/api/img"
const uploadFile = ref(false)
const fileList = ref([])

const upload = () => {
  fileList.value = []
  uploadFile.value = true
}
const clickSave = (formEL) => {
  //验证数据是否合格
  formEL.validate((flag) => {
    console.log("提交。。。" + flag)
    if (!flag) return
    let attachment = null
    if (fileList.value.length > 0) {
      attachment = fileList.value[0].url
    }

    //这个设置上传多个文件方法
    /*if(fileList.value.length>0){
        let fileUrls = [];
        fileList.value.forEach(f=>{
            fileUrls.push(f.url)
        });
        attachment = fileUrls.join(';')
    }*/

    funUploadFile(p).then((res) => {
      if (!res.success) {
        ElMessage.error(res.message)
        return
      }
      uploadFile.value = false
    })
  })
}
//上传前校验
const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 10MB！")
    return
  }
  if (fileList.value.length > 1) {
    ElMessage.error("只支持上传一个文件")
    return
  }

  //这个设置上传多个文件，可根据自己业务情况决定，本文只是上传一个
  /*if(fileList.value.length>5){
      ElMessage.error('只支持5个文件');
      return;
  }*/

  const fd = new FormData()
  console.log(file)
  fd.append("file", file)
  fd.append("name", file.name)
  uploadImg(fd)
    .then(() => {
      alert("OK")
    })
    .catch(() => {
      alert("Error")
    })
}
//文件移除配置方法
const handleRemove = (file: any, files: never[]) => {
  fileList.value = files
}
</script>
<template>
  <div>
    <el-button type="primary" icon="CirclePlus" @click="upload()">上传文件</el-button>

    <el-dialog title="上传文件" :close-on-click-modal="false" v-model="uploadFile" width="500px">
      <el-upload
        class="upload-demo"
        drag
        accept=".pdf,.doc,.docx,.png,.jpg"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-remove="handleRemove"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，<em>或点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只支持pdf、doc、docx、png、jpg</div>
        </template>
      </el-upload>

      <template #footer>
        <div style="text-align: center; width: 100%">
          <el-button type="primary" style="width: 200px" @click="clickSave(upload)">提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped></style>
