<template>
  <div>
    <input name="imageFile" type="file" id="image1" ref="uploadImage" v-on:change="getBase64"/>
  </div>
</template>
<script>
export default {
  props:['label','dat'],
  data(){
    return{
      scriptImage:""
    }
  },
  methods:{
    getBase64() {
      let sendData = this.$props.dat
      let image = this
      var reader = new FileReader();
      if(this.$refs.uploadImage.files[0].size<2097152){
        reader.readAsDataURL(this.$refs.uploadImage.files[0]);
        reader.onload = function () {
          image.$emit('selectImage',{details:sendData,image:reader.result})
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: "File Should be less than 2MB"
        })
        this.$refs.uploadImage.files = null
      }

    },
  }
}
</script>
