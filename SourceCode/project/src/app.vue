<template>
		<!--在线对话-->
		<div class="gx-socket" id="app">
			<div class="socket-box">
				<div class="socket-left">
					<div class="socket-logo">
						<img src="">
						<p class="name">用户名用户名用户</p>
						<p class="grade"><i class="socket-icon"></i>**会员</p>
					</div>
					<div class="socket-search">
						<input type="text" name="">
						<button class="socket-icon"></button>
					</div>
					<div class="socket-list">
						<ul>
							<li>
								<img class="logo" src="">
								<p class="title">店铺店铺店铺</p>
								<p class="txtle">欢迎咨询在线客服！<span>88</span></p>
								<p class="time">2016-12-12</p>
							</li>

						</ul>
					</div>
				</div>
				<div class="socket-right">
					<div class="socket-name">店铺一</div>
					<div class="socket-info">

						<!--没有选中店铺时显示-->
						<div class="not-tell none">
							<span class="socket-icon"></span>您还未选中或发起聊天，快去聊一聊吧
						</div>
						<!--没有选中店铺时显示结束-->

						<div class="tell-list">
							<ul>
								<li><span>欢迎咨询在线客服！</span></li>
								<li class="own"><span>你好!</span></li>
								<li><span>你好!</span></li>
							</ul>
						</div>

					</div>
					<div class="socket-send">
						<div class="socket-face">
							<div class="face-box">
								<ul>
								</ul>
							</div>
							<span class="face socket-icon"></span>
							<span class="price socket-icon"><input type="file" id="img_upload"/></span>
						</div>
						<div class="socket-input">
							<form onsubmit="return false">
								<div class="input" contenteditable="true"></div>
								<button>发送</button>
							</form>
						</div>

					</div>
				</div>
			</div>

		</div>
		<!--在线对话结束-->
</template>

<script lang="ts">
import { Vue, Component } from 'av-ts'

@Component
class App extends Vue {
  name:string = 'Rem'

  hello() {
    alert(this.name + ' is the best girl!')
  }
}

export default App
</script>

<style scoped>
@import '../static/styles/gxIndex.css'
</style>
