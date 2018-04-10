<template>
  <div>
    <h2 class="title">Modify your workout</h2>
      <form>
        <input v-model="name" type="text" class="input" :placeholder="mode.workout ? mode.workout.name : ''">
        <textarea v-model="description" type="text" class="input" :placeholder="mode.workout ? mode.workout.description : ''"></textarea>
        <div class="image-upload">
          <img :src="mode.workout ? mode.workout.pictures[0] : ''">
          <label class="title" for="imageFile">Relace the image</label>
          <input @change="filesChange($event.target.files)" type="file" multiple class="form-control-file" ref="imageFile">
        </div>
        <div class="row">
          <div class="col">
            <button v-show="!isCreating" @click="onCancel" type="button" class="button button-primary">Cancel</button>
          </div>
          <div class="col">
            <button v-show="!isCreating" @click="onCreateNew" type="submit" class="button button-primary">Apply</button>
          </div>
        </div>
      </form>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    data () {
      return {
        name: '',
        description: '',
        pictures: [],
        isCreating: false
      }
    },
    computed: {
      ...mapGetters({mode: 'getMode'})
    },
    methods: {
      ...mapActions(['modifyWorkout', 'uploadImages']),
      filesChange (files) {
        this.pictures = [...files]
      },
      reset () {
        this.name = ''
        this.description = ''
        this.pictures = []
        this.$refs.imageFile.value = null
      },
      onCancel (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        this.reset()
        this.$emit('update:control', false)
      },
      onCreateNew (ev) {
        this.isCreating = true
        this.$emit('update:control', false)
        ev.preventDefault()
        ev.stopPropagation()
        if (this.name.length > 0 && this.description.length > 0 && this.pictures.length > 0) {
          this.uploadImages(this.pictures).then(picUrls => {
            this.modifyWorkout({
              key: this.mode.workout['.key'],
              name: this.name,
              description: this.description,
              pictures: picUrls
            }).then(() => {
              this.reset()
              this.isCreating = false
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
</style>
