<template>
  <header class="header">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light row">
        <div class="navbar-brand">
          <logo></logo>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarHeader">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <nuxt-link class="nav-link profitoro-link" to="/">Home </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link profitoro-link" to="about">About </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link profitoro-link" :class="{disabled:!isAuthenticated}" to="settings">Settings </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link profitoro-link" :class="{disabled:!isAuthenticated}" to="statistics">Statistics </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link profitoro-link" :class="{disabled:!isAuthenticated}" to="workouts">Workouts </nuxt-link>
            </li>
          </ul>
          <form class="buttons-holder d-lg-none">
            <span v-if="isAuthenticated" class="nav-link profitoro-link" @click="onLogout">Logout</span>
            <span v-if="!isAuthenticated" class="nav-link profitoro-link" @click="onLogout">Go to the start page</span>
          </form>
          <div class="panel-group d-none d-lg-block">
            <div class="panel panel-default">
              <div class="panel-heading">
                <a data-toggle="collapse" href="#collapse1">
                  <img :title="this.displayName" class="iconImage img-thumbnail rounded-circle" :src="this.picProfile ? this.picProfile : this.photoURL">
                </a>
              </div>
              <div id="collapse1" class="panel-collapse collapse">
                <ul class="list-group">
                  <!-- <li class="list-group-item">{{this.displayName}}</li> -->
                  <li v-if="isAuthenticated" class="list-group-item nav-link profitoro-link" @click="onLogout">logout</li>
                  <li v-if="!isAuthenticated" class="list-group-item nav-link profitoro-link" @click="onLogout">Go to the start page</li>
                  <li v-show="isAuthenticated" class="list-group-item nav-link profitoro-link" @click="onSettings">Settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import Logo from '~/components/common/Logo'

  export default {
    props: ['picProfile'],
    name: 'header-component',
    data () {
      return {
        displayName: 'Anonimo',
        photoURL: 'https://thumbs.dreamstime.com/z/icono-an%C3%B3nimo-del-usuario-89671074.jpg'
      }
    },
    created () {
      if (this.isAuthenticated) {
        this.displayName = this.user.displayName
        this.photoURL = this.user.photoURL ? this.user.photoURL : this.photoURL
      }
    },
    computed: {
      ...mapGetters({name: 'getDisplayName', isAuthenticated: 'isAuthenticated', user: 'getUser'})
    },
    methods: {
      ...mapActions(['logout']),
      onLogout () {
        this.logout()
        this.$router.push('/')
      },
      onSettings () {
        this.$router.push('settings')
      }
    },
    components: {
      Logo
    }
  }
</script>
<style lang="scss">
  @import "../../assets/styles/base/colors";
  @import "../../assets/styles/base/variables";
  @import "../../assets/styles/vendors/flex";
  @import "../../assets/styles/vendors/bootstrap/functions";
  @import "../../assets/styles/vendors/bootstrap/variables";
  @import "../../assets/styles/vendors/bootstrap/mixins";

  .header {
    height: $header-height;
    color: $color-primary;

    @include media-breakpoint-down(md) {
      height: auto;
      min-height: $header-md-height;
      background-color: $color-white;
    }
    .container {
      height: 100%;
    }
    .nuxt-link-active {
      font-weight: bold;
    }
    .nav-link.profitoro-link {
      color: rgba($color-primary, 0.7);
      cursor: pointer;

      @include media-breakpoint-down(md) {
        padding-right: 0;
        padding-left: 0;
      }
      &:hover,
      &:active,
      &:focus {
        color: $color-primary;
      }
      &.disabled {
        cursor: default;
        color: $nav-link-disabled-color;
      }
    }
    .buttons-holder {
      margin-left: 60px;
      @include media-breakpoint-down(md) {
        margin-left: 0;
      }
    }
    .panel-group {
       margin-left: 60px;
    }
    .iconImage{
      max-width: 8em;
      max-height: 4em;
    }
  }
</style>
