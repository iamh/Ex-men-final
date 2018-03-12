<template>
  <div>
    <header-component></header-component>
    <div class="container min-full-height">
      <div class="main-content row">
        <div class="col-sm-12">
          <h2 class="title">Statistics</h2>
          <div class="jumbotron">
            <h2 class="display-4">Total Pomodoros: {{totalPomodoros || 0}}</h2>
            <hr class="my-4">
            <ul>
              <li v-for="(workout, index) in workouts" :key="workout.key">                
                <div class="progressbar" :style="{backgroundColor: index % 2 === 0 ? 'lightgrey' : 'darkgrey'}">
                  <div class="progress" @click="showDetails(workout)" :style="{width: workout.count * 90 / maxWorkoutCount + '%', backgroundColor: colors[index % colors.length]}">                  
                  </div>
                  <span class="workout">{{ workout.name }}</span>
                  <span v-if="showCount" class="workout count">{{ workout.count }}</span>                                    
                </div>                
              </li>
            </ul>
          </div>
        </div>        
      </div>
    <div class="modal fade show" :style="{display: details ? 'block': 'none'}">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{details.name}}</h5>
            <button type="button" @click="hideDetails" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Times: {{details.count}}</p>
            <p>Total time: {{formatTime(details.time)}}</p>
            
          </div>
          <div class="modal-footer">
            <button type="button" @click="hideDetails" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <footer-component></footer-component>
    </div>
  </div>
</template>
<script>
  import { HeaderComponent, FooterComponent } from '~/components/common'
  import {mapGetters} from 'vuex'
  import { setTimeout } from 'timers'
  export default {
    data () {
      return {
        colors: ['red', 'blue', 'green', 'brown'],
        initRender: true,
        showCount: false,
        timeoutId: null,
        details: ''
      }
    },
    methods: {
      showDetails (workout) {
        this.details = {...workout, ...this.getWorkoutsDoneDetails(workout.key)}
      },
      hideDetails () {
        this.details = ''
      },
      formatTime (time) {
        let hours = Math.floor(time / 3600)
        let minutes = Math.floor((time - (hours * 3600)) / 60)
        let seconds = time - (hours * 3600) - (minutes * 60)

        if (hours < 10) hours = '0' + hours
        if (minutes < 10) minutes = '0' + minutes
        if (seconds < 10) seconds = '0' + seconds
        return hours + ':' + minutes + ':' + seconds
      }
    },
    middleware: 'authenticated',
    computed: {
      ...mapGetters({
        totalPomodoros: 'getTotalPomodoros',
        getWorkoutsDone: 'getWorkoutsDone',
        getWorkoutsDoneDetails: 'getWorkoutsDoneDetails'
      }),
      maxWorkoutCount () {
        return this.getWorkoutsDone && this.getWorkoutsDone.reduce((max, {count}) => Math.max(max, count), 0)
      },
      workouts () {
        return this.getWorkoutsDone.map(({name, count, key}) => ({name, count: this.initRender ? 0 : count, key}))
      }
    },
    mounted () {
      setTimeout(() => {
        this.showCount = true
      }, 3000)
    },
    updated () {
      this.initRender = false
    },
    components: {
      HeaderComponent,
      FooterComponent
    }
  }
</script>
<style scoped lang="scss">

  ul {
    list-style-type: none;
  }

  ul li {
    margin-top: 10px;
  }

  .progressbar {
    width: 100%;
    height: 50px;
    border-radius: 4px;
    padding: 10px;
    padding: 10px;
  }

 .progressbar .progress {
    border-radius: 4px;
    transition: width 2000ms ease-in-out 1000ms;
    height: 100%;
  }
  .progressbar .workout {
    color: white;
    font-size: 18px;
    font-weight: 1000;
    position: relative;
    top: -30px;
    left: 10px;
  }
  .progressbar .count {
    float: right;
    padding-right: 10px;
  }
</style>
