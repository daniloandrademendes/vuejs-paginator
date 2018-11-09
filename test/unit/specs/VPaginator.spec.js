import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource'
import VPaginator from 'dist/vuejs-paginator'
import {mockedResponse, options} from './data.js'
import { mount } from '@vue/test-utils'
Vue.use(VueResource)

describe('VPaginator.vue', () => {
  it('should render the paginator', () => {
    const vm = new Vue({
      data: { dummies: [] },
      template: '<div><v-paginator resource_url=""></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    expect(vm.$el.querySelector('.v-paginator').textContent).to.contain('Previous')
  })
  it('should render the paginator with custom button texts', () => {
    const options = { previous_button_text: 'Go back' }
    const vm = new Vue({
      data: { dummies: [], options: options },
      template: '<div><v-paginator resource_url="" :resource.sync="dummies" :options="options"></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    expect(vm.$el.querySelector('.v-paginator').textContent).to.contain('Go back')
  })
  it('should render the paginator with custom classes', () => {
    const options = { classes_next: 'btn btn-primary' }
    const vm = new Vue({
      data: { dummies: [], options: options },
      template: '<div><v-paginator resource_url="" :resource.sync="dummies" :options="options"></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    expect(vm.$el.querySelector('.btn-primary').textContent).to.contain('Next')
  })
  it('should set pagination data correctly', () => {
    const vm = new Vue({
      data: { dummies: [], options: options },
      template: '<div><v-paginator resource_url="" :resource.sync="dummies" :options="options"></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    console.log("mockedResponse")
    console.log(mockedResponse)
    vm.$children[0].handleResponseData(mockedResponse)
    // expect that pagination data have been set correctly
    expect(vm.$children[0].next_page_url).to.equal(mockedResponse.nested.next_page_url)
    expect(vm.$children[0].next_page_url).to.not.equal('something else')
    expect(vm.$children[0].prev_page_url).to.equal(mockedResponse.nested.prev_page_url)
    expect(vm.$children[0].current_page).to.equal(mockedResponse.nested.current_page)
    expect(vm.$children[0].last_page).to.equal(mockedResponse.nested.last_page)
    expect(vm.$children[0].items_count).to.equal(mockedResponse.nested.items_count)
  })
  it('should render paginator messages correctly', () => {
    var myOptions = JSON.parse(JSON.stringify(options))
    myOptions.message_format = '{{current_page}} {{last_page}} {{items_count}}'
    myOptions.classes_message = 'message'
    const vm = new Vue({
      data: { dummies: [], options: myOptions },
      template: '<div><v-paginator ref="paginator" resource_url="" :resource.sync="dummies" :options="options"></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    vm.$refs.paginator.handleResponseData(mockedResponse)
    vm.$nextTick(() => {
      expect(vm.$el.querySelector('.message').textContent).to.contain('1 3 5')
    })
  })
  it('should use custom http handler', () => {
    var myOptions = JSON.parse(JSON.stringify(options))
    const customHttpHandler = {
      used: false,
      get (url) {
        console.log(`PASSOU: ${url}`)
        this.used = true
        return new Promise(() => {})
      }
    }
    myOptions.http_handler = customHttpHandler
    const wrapper = mount(VPaginator, {
      propsData: {
        options: myOptions,
        resource_url: 'bla'
      }
    })
    expect(customHttpHandler.used).to.equal(true)
  })
  it('should emit update after fetching data', () => {
    const wrapper = mount(VPaginator, {
      propsData: {
        options: options,
        resource_url: ''
      }
    })
    wrapper.vm.handleResponseData(mockedResponse)
    let resource = wrapper.emitted().update[0][0]
    expect(resource).to.have.length(5)
  })
  it('should merge options with default config', () => {
    const options = { previous_button_text: 'Go back' }
    const vm = new Vue({
      data: { dummies: [], options: options },
      template: '<div><v-paginator resource_url="" :resource.sync="dummies" :options="options"></v-paginator></div>',
      components: { VPaginator }
    }).$mount()
    vm.$children[0].initConfig()
    // check that response data have been reflected to current instance
    expect(vm.$children[0].config.previous_button_text).to.equal('Go back')
  })
})
