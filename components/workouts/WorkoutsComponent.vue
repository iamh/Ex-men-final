<template>
  <div>
    <h2 class="title">Manage your workouts</h2>
    <div class="form-group">
      <input v-model="searchTerm" class="input" :disabled="op" type="search" :placeholder="op ? 'Modifying the workouts' : 'Search for workouts'">
    </div>
    <div class="card-columns">
      <div data-toggle="modal" v-for="(workout, key) in workoutsToDisplayPaginated" :key="key" class="card" @click="onChosenWorkout(workout)">
        <div :class="['img-selector', !op ? '' : (workout['.key'] === mode.workout['.key'] ? 'img-scale-up' : 'img-scale-down') ]">
          <img class="card-img-top img-fluid" :src="workout.pictures && workout.pictures.length && workout.pictures[0]" :alt="workout.name">
          <i :class="['icon material-icons', op && workout['.key'] === mode.workout['.key'] ? 'icon-transition' : '']" @click="onDelete(workout['.key'])">delete</i>
          <div class="card-block">
            <p class="card-text">{{ workout.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <workouts-pagination-component @loadMore="onLoadMore" :hasMore="hasMore"></workouts-pagination-component>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import WorkoutsPaginationComponent from '~/components/workouts/WorkoutsPaginationComponent'
  import moment from 'moment'

  export default {
    props: ['op'],
    data () {
      return {
        name: '',
        username: '',
        datecreated: '',
        description: '',
        pictures: [],
        rate: 0,
        searchTerm: '',
        pageSize: 3,
        actualWorkoutsSize: 3
      }
    },
    computed: {
      ...mapGetters({workouts: 'getWorkouts', mode: 'getMode'}),
      workoutsToDisplay () {
        return this.workouts.filter(workout => {
          let name = workout.name.toLowerCase()
          let description = workout.description.toLowerCase()
          let username = workout.username.toLowerCase()
          let term = this.searchTerm.toLowerCase()
          return name.indexOf(term) >= 0 || description.indexOf(term) >= 0 || username.indexOf(term) >= 0
        })
      },
      workoutsToDisplayPaginated () {
        return this.workoutsToDisplay.slice(0, this.actualWorkoutsSize)
      },
      hasMore () {
        return this.workoutsToDisplay.length > this.actualWorkoutsSize
      }
    },
    components: {
      WorkoutsPaginationComponent
    },
    methods: {
      ...mapActions(['setMode', 'deleteWorkout']),
      onChosenWorkout (workout) {
        this.name = workout.name
        this.description = workout.description
        this.username = workout.username
        this.datecreated = moment(workout.date).format('MMM Do YY')
        this.rate = workout.rate
        this.pictures = workout.pictures
        this.setMode({
          workout: {...workout}
        })
        this.$emit('update:control', true)
      },
      onLoadMore () {
        this.actualWorkoutsSize = this.actualWorkoutsSize + this.pageSize
      },
      onDelete (key) {
        event.stopPropagation()
        this.deleteWorkout(key)
        this.reset()
      },
      reset () {
        this.setMode({workout: null})
        this.$emit('update:control', false)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../assets/styles/vendors/bootstrap/functions";
  @import "../../assets/styles/vendors/bootstrap/variables";
  @import "../../assets/styles/vendors/bootstrap/mixins";
  .card-columns {
    .card {
      cursor: pointer;
      border: none;
    }
    @include media-breakpoint-only(lg) {
      column-count: 3;
    }
    @include media-breakpoint-only(xl) {
      column-count: 4;
    }
    p.card-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .img-selector {
    transition: transform 0.5s;
    }
    .img-scale-up {    
      transform: scale(1.1);
    }
    .img-scale-down {    
      transform: scale(0.9);    
      opacity: 0.5;
    }
    .icon {
      position: absolute;
      margin: 5px 0 0 -25px;
      color: #CD5C5C;
      font-size: 0.1px;
      -webkit-transition: font-size 1s;
      transition: font-size 1s; 
    }
    .icon-transition {
      font-size: 1.5rem;
    }
 
  }
</style>
