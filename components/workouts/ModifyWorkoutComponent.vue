<template>
  <div>
    <div v-show="isCreating" class="modal-wrapper">
      <div class="modal">
        <clip-loader/>
      </div>
    </div>
    <div class="modal-wrapper-buttons"  v-show="hidden">
      <div class="modal-buttons">
        <h4>Desea guardar los cambios?</h4>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="onModal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="onModify">Save changes</button>
        </div>
      </div>
    </div>
    <h2 class="title">Modify your workout</h2>
      <form>
        <input v-model="mode.workout.name" type="text" class="input">
        <textarea v-model="mode.workout.description" type="text" class="input"></textarea>
        <div class="image-upload">
          <img :src="mode.workout.pictures[0]">
          <label class="title" for="imageFile">Relace the image</label>
          <input @change="filesChange($event.target.files)" type="file" multiple class="form-control-file" ref="imageFile">
        </div>
        <div class="row">
          <div class="col">
            <button v-show="!isCreating" @click="onCancel" type="button" class="button button-primary">Cancel</button>
          </div>
          <div class="col">
            <button v-show="!isCreating" type="button" class="button button-primary" :disabled="this.mode.workout.name == '' || this.mode.workout.description == ''" @click="onModal">Apply</button>
          </div>
        </div>
      </form>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  export default {
    data () {
      return {
        pictures: [],
        isCreating: false,
        hidden: false
      }
    },
    components: {
      ClipLoader
    },
    computed: {
      ...mapGetters({mode: 'getMode'})
    },
    methods: {
      ...mapActions(['modifyWorkout', 'uploadImages', 'setMode']),
      filesChange (files) {
        this.pictures = [...files]
      },
      reset () {
        this.setMode({workout: null})
        this.isCreating = false
      },
      onModal () {
        if (!this.hidden) {
          this.hidden = true
        } else {
          this.hidden = false
        }
      },
      onCancel (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        this.reset()
        this.$emit('update:control', false)
      },
      onModify (ev) {
        this.hidden = false
        this.isCreating = true
        this.$emit('update:control', false)
        ev.preventDefault()
        ev.stopPropagation()
        if (this.mode.workout.name.length > 0 && this.mode.workout.description.length > 0) {
          this.uploadImages(this.pictures).then(picUrls => {
            this.modifyWorkout({workout: this.mode.workout, picUrls}).then(() => {
              this.reset()
            })
          })
        } else {
          this.isCreating = false
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .title {
    width: 100%;
  }
  .img-upload {
    width: 200px;
  }
  img {
    width: 200px;
  }
  .row {
    margin-top: 1em;
  }
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 99999999;
    background-color:rgba(0,0,0,.2)
  }
  .modal-wrapper:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  .modal {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin: 0 auto;    
  }
  .modal-wrapper-buttons {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999999;
    background-color:rgba(0,0,0,.2)
  }
  .modal-buttons {
    position: relative;
    width: 30%;
    margin: 90px auto;
  }
  .button.button-primary:disabled {
    background-color: grey;
  }
  h4 {
    color: #4B8A08;
    font-weight: 800;
  }
</style>
