import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import websiteIndex from '@/pages/website/index'
import createNews from '@/pages/website/createNews'
import activity from '@/pages/website/activity'
import banner from '@/pages/website/banner'
import home from '@/pages/home/home'
import distributionIndex from '@/pages/distribution/index'
import distributionBill from '@/pages/distribution/bill'
import Login from '@/pages/login'
import advert from '@/pages/website/advert'
import eventActivity from '@/pages/website/eventActivity'
import datum from '@/pages/website/datum'
import member from '@/pages/website/member'
import visAct from '@/pages/website/visAct'
import goods from '@/pages/mall/goods'
import createGoods from '@/pages/mall/createGoods.vue'
import bill from '@/pages/mall/bill.vue'
import mallAdvert from '@/pages/mall/goodsIndex.vue'
import invoice from '@/pages/mall/invoice.vue'
import caiwu from '@/pages/distribution/caiwu.vue'
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
	　　　　path: '/website/member', 
	 　　　 component: member 
	　　  },{
	　　　　path: '/website/datum', 
	 　　　 component: datum 
	　　  },{
	　　　　path: '/distribution/bill', 
	 　　　 component: distributionBill,
	　　  },{
	　　　　path: '/distribution/index', 
	 　　　 component: distributionIndex,
	　　  },{
			path: '/website/visAct', 
	 　　　 component: visAct,
		  },{
			path: '/mall/goods', 
	 　　　 component: goods,
		  },{
			path: '/mall/creategoods/:id', 
	 　　　 component: createGoods,
		  },{
			path: '/mall/bill', 
	 　　　 component: bill,
		  },{
			path: '/mall/advert', 
	 　　　 component: mallAdvert,
		  },{
			path: '/mall/invoice', 
	 　　　 component: invoice,
		  },{
			path: '/distribution/caiwu', 
	 　　　 component: caiwu,
		  }
	　]
    },{
    	path: '/login',
	    name: 'Login',
	    component: Login,
    }
  ]
})
