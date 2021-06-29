import React from 'react'
import './landingPage.scss'
import { Link } from "react-router-dom";


// Load Title
export function LandingPage(): JSX.Element {
  return(
  <div className="startPage">
    <nav className="nav">
      <button id="login">Login</button>
      <button id="register">Register</button>
    </nav>
    
    <div className="container">
      <div className="sub-container">
        <h1>Schnopsn</h1>
        <div className="startButtons">
          <Link to="/2erSchnopsn"><button id="2er">2er Schnopsn</button></Link>
          <Link to="/4erSchnopsn"><button id="4er">4er Schnopsn</button></Link>
        </div>
      </div>
    </div>
  </div>
  )
}
