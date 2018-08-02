import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import websiteIndex from '@/components/website/index'
import createNews from '@/components/website/createNews'
import activity from '@/components/website/activity'
import banner from '@/components/website/banner'
import home from '@/components/home'
import distributionIndex from '@/components/distribution/index'
import Login from '@/components/login'
import advert from '@/components/website/advert'
import eventActivity from '@/components/website/eventActivity'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'websiteIndex',
      component: index,
      children: [ 
      	  {
	　　　　path: '/', 
	 　　　 component: home 
	　　  },
		  {
	　　　　path: '/home', 
	 　　　 component: home 
	　　  },
	　　　{
	　　　　path: '/website', 
	 　　　 component: websiteIndex,
	　　  },
		  {
	　　　　path: '/website/index', 
	 　　　 component: websiteIndex 
	　　  },
		  {
	　　　　path: '/website/createnews', 
	 　　　 component: createNews 
	　　  },
		  {
	　　　　path: '/website/activity', 
	 　　　 component: activity 
	　　  },
		  {
	　　　　path: '/website/banner', 
	 　　　 component: banner 
	　　  },{
	　　　　path: '/website/eventActivity', 
	 　　　 component: eventActivity 
	　　  },{
	　　　　path: '/website/advert', 
	 　　　 component: advert 
	　　  },{
	　　　　path: '/distribution', 
	 　　　 component: distributionIndex,
	 		children:[
	 		  {
		　　　　path: '/distribution/index', 
		 　　　 component: distributionIndex 
		　　  }
			  
	 		]
	　　  }
	　]
    },{
    	path: '/login',
	    name: 'Login',
	    component: Login,
    }
  ]
})
