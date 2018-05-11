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
        <input v-model="mode.workout.name" type="text" class="input" placeholder="Name it">
        <textarea v-model="mode.workout.description" type="text" class="input" placeholder="Describe it"></textarea>
        <div>
          <i :style="{color: !select ? 'red' : 'grey'}" class="icon-edit material-icons" @click="onSelect" title="Edit">create</i>
          <i v-if="select" class="icon-delete material-icons" @click="onDeletePic" title="Delete">delete</i>
          <div v-if="this.mode.workout.pictures" class="container-img">
            <div v-for="(imagen, key) in getPictures" :key="key">
              <img :src="imagen">
              <input v-if="select" :id="key" v-model="checked" :value="key" class="check" type="checkbox">
              <i v-if="select" class="icon-profile material-icons" @click="selectProfile(key)" title="this profile picture">face</i>
            </div>
          </div>
          <label class="title" for="imageFile">Relace the image</label>
          <input @change="previewFile($event.target.files)" type="file" :disabled="select" multiple class="form-control-file" ref="imageFile">
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
        firePictures: [],
        newPictures: [],
        auxPictures: [],
        pic: [],
        isCreating: false,
        hidden: false,
        select: false,
        checked: []
      }
    },
    components: {
      ClipLoader
    },
    computed: {
      ...mapGetters({mode: 'getMode'}),
      getPictures () {
        this.pictures = this.mode.workout.pictures.concat(this.newPictures)
        return this.pictures
      }
    },
    watch: {
      mode () {
        this.$refs.imageFile.value = null
        this.newPictures = []
        this.select = false
        this.checked = []
      }
    },
    methods: {
      ...mapActions(['modifyWorkout', 'setMode', 'deletePicture', 'uploadImages', 'setImgProfile']),
      previewFile (files) {
        this.firePictures = [...files]
        for (let i = 0; i < event.target.files.length; i++) {
          var reader = new FileReader()
          reader.onload = (event) => {
            this.newPictures.push(event.target.result)
          }
          reader.readAsDataURL(event.target.files[i])
        }
      },
      reset () {
        this.$emit('update:control', false)
        this.setMode({workout: null})
        this.select = false
        this.checked = []
      },
      onModal () {
        if (!this.hidden) {
          this.hidden = true
        } else {
          this.hidden = false
        }
      },
      onSelect () {
        if (!this.select) {
          this.select = true
        } else {
          this.select = false
          this.checked = []
        }
      },
      onCancel (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        this.reset()
      },
      onDeletePic () {
        this.newPictures = []
        this.checked = this.checked.sort().reverse()
        for (let i = 0; i < this.checked.length; i++) {
          this.pictures = this.pictures.filter((value, index) => index !== this.checked[i])
        }
        this.checked = []
        this.mode.workout.pictures = this.pictures
      },
     /* onDeletePic (key) {
        this.newPictures = []
        this.pictures = this.pictures.filter((value, index) => index !== key)
        this.mode.workout.pictures = this.pictures
      }, */
      selectProfile (key) {
      },
      onModify (ev) {
        this.hidden = false
        ev.preventDefault()
        ev.stopPropagation()
        for (let i = 0; i < this.pictures.length; i++) {
          if (this.mode.workout.pictures.includes(this.pictures[i])) {
            this.auxPictures.push(this.pictures[i])
          }
        }
        if (this.mode.workout.name.length > 0 && this.mode.workout.description.length > 0) {
          this.uploadImages(this.firePictures).then(picUrls => {
            this.modifyWorkout({
              workout: this.mode.workout,
              pictures: this.auxPictures.concat(picUrls)
            }).then(() => {
              this.reset()
              this.isCreating = false
            })
          }).then(() => {
            this.reset()
            this.isCreating = false
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
  .container-img {
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
  }
  img {
    width: 160px;
    margin-right: 0.5em;
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
  .icon-edit {
    position: absolute;
    margin: 0 0 0 -40px;
    cursor: pointer;
  }
  .icon-delete {
    position: absolute;
    margin: 30px 0 0 -40px;
    cursor: pointer;
    color: #CD5C5C;
  }
  .check {
    position: absolute;
    margin: 5px 0 0 -25px;
    cursor: pointer;
  }
  .icon-profile {
    position: absolute;
    margin: 30px 0 0 -25px;
    cursor: pointer;
    color: #CD5C5C;
    font-size: 1rem;
  }
</style>
