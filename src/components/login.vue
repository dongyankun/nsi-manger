<template>
  <div class="loginContainer">
    <div id="canvascontainer" ref='can'></div>
    <el-form class="loginFrom" :model="form" :rules="rules" ref="form" label-width="0">
        <div class="NSItitle">新学说官网</div>
        <div class="outIconfont">
            <span class="iconfont icon-xingmingyonghumingnicheng"></span> 
            <el-form-item label="" prop="userName">
              <el-input @keydown.enter.native="userLogin" v-model="form.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </div>
        <div class="outIconfont">
            <span class="iconfont icon-07"></span>
            <el-form-item label="" prop="passWord">
              <el-input @keydown.enter.native="userLogin" v-model="form.passWord" onfocus="this.type='password'" placeholder="请输入密码" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        <el-button class="loginBtn" @click="userLogin" type="primary">登录</el-button>
        <span size="mini" style="margin:10px 0 0 20px;font-size:14px;float:left;color:#999;cursor:pointer;" @click="forgetPas">忘记密码</span>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      form:{
        userName:'',
        passWord:''
      },
      rules: {
          userName: [
            { required: true, message: '请输入帐户名', trigger: 'blur' }
          ],
          passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
    }
  },
  methods:{
    userLogin(){
      let that=this
      this.$refs.form.validate((valid) => {
        if(valid){
          if(that.form.userName.indexOf('xinxueshuo.cn')<0){
            that.$message({
              message: '权限不足,请联系技术人员',
              type: 'error'
            });
            return
          }
          //生成token
          let timestamp=(new Date().getTime()).toString()
          //console.log(timestamp)
          let randomnum=Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)+''+timestamp.slice(4,)
          //console.log(randomnum)
          let url=that.baseUrl+'/user/login.do'
          let loginInfor=new URLSearchParams();
          loginInfor.append('userName',that.form.userName);
          loginInfor.append('passWord',that.form.passWord);
          loginInfor.append('token',randomnum);
          that.$axios.post(url,loginInfor).then(resp => {
              if(resp.data.msg=='登录成功'){
                that.$message({
                  message: resp.data.msg,
                  type: 'sucess'
                });
                localStorage["userName"] = that.form.userName
                setTimeout(function(){
                  that.$router.push({path:'/home'});
                },1000)
              }else{
                that.$message({
                  message: resp.data.msg,
                  type: 'error'
                });
              }

          }).catch(err=>{
              that.$message({
                message: '登录失败,请联系技术人员',
                type: 'error'
              });
          })
        }else{
          that.$message({
                message: '请输入用户名密码',
                type: 'error'
            });
          }
      })
    },
    forgetPas(){
      window.open('http://data.xinxueshuo.cn/nsi/user/password.html','_blank')
      //http://data.xinxueshuo.cn/nsi/user/password.html
    }
  },
  created(){

  },
  mounted(){
    var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
    var container;
    var camera, scene, renderer;
    var particles, particle, count = 0;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    container = document.createElement( 'div' );
    var canvascontainer=document.getElementById('canvascontainer')
    canvascontainer.appendChild( container );  
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene = new THREE.Scene();
    particles = new Array();
    var PI2 = Math.PI * 2;
    var material = new THREE.ParticleCanvasMaterial( {
      color: 0x0078de,
      program: function ( context ) {
        context.beginPath();
        context.arc( 0, 0, 1, 0, PI2, true );
        context.fill();
      }
    } );
    var i = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
          particle = particles[ i ++ ] = new THREE.Particle( material );
          particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
          particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
          scene.add( particle );
        }
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    animate();
    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function onDocumentMouseMove( event ) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }
    function onDocumentTouchStart( event ) {
      if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;

      }
    }
    function onDocumentTouchMove( event ) {
      if ( event.touches.length === 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        mouseY = event.touches[ 0 ].pageY - windowHalfY;
      }
    }
    function animate() {
      requestAnimationFrame( animate );
      render();
    }
    function render() {
      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - mouseY - camera.position.y ) * .05;
      camera.lookAt( scene.position );
      var i = 0;
      for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
          particle = particles[ i++ ];
          particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
          particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;
        }
      }
      renderer.render( scene, camera );
      count += 0.1;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  :-webkit-autofill {
   -webkit-text-fill-color: #fff !important;
   transition: background-color 50000s ease-in-out 0s;
  }
  *{
    margin: 0;
    padding: 0;
  }
  #canvascontainer{
      height: 100%;
      position: absolute;
      top: 0px;
      overflow:hidden;
      div{
        height: 100%;
      }
  }
  .loginContainer{
    height: 100%;
    background-color: rgb(20, 26, 72);
    .loginFrom{
        position: absolute;
        left: 0;
        right: 0;
        width: 330px;
        padding: 35px 35px 15px;
        margin: 120px auto;
        .outIconfont{
          position:relative;
        }
        .NSItitle{
          color:#fff;
          margin:0 0 20px 0;
          font-size:30px;
        }
        input{
          height: 47px;
          border:none;
          background:#495060;
          color:#fff;
          text-indent:20px;
        }
        .icon-xingmingyonghumingnicheng,.icon-07{
          position:absolute;
          color:#fff;
          top:10px;
          left:0;
          z-index:2;
          lineheight:47px;
          margin:5px 5px 0 7px;
        }
        .loginBtn{
            display: inline-block;
            margin-bottom: 0;
            width: 100%;
            text-align: center;
            vertical-align: middle;
            
            touch-action: manipulation;
            cursor: pointer;
            background-image: none;
            border: 1px solid transparent;
            white-space: nowrap;
            line-height: 1.5;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            padding: 6px 15px;
            font-size: 12px;
            border-radius: 4px;
        }
    }
  }

</style>
