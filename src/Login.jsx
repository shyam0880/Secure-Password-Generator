import React from 'react'

const Login = ({popup, setpopup}) => {
  return (
    <div class="form-container">
        <p class="title">Login</p>
        <form class="form">
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" placeholder=""/>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" placeholder=""/>
                <div class="forgot">
                    <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                </div>
            </div>
            <button class="sign">Sign in</button>
        <p class="signup">Don't have an account?
            <a rel="noopener noreferrer" href="#" class=""> Sign up</a>
        </p>
        <span onClick={()=>{setpopup(!popup)}}>close</span>
        </form>
    </div>
  )
}

export default Login
