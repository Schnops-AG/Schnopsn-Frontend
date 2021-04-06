import React from 'react'
import './startPage.scss'
import {
  Link
} from "react-router-dom";


// Load Title
export function StartPage(): JSX.Element {
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
          <Link to="/">Home</Link>
          <button id="2er">2er Schnopsn</button>
          <button id="4er">4er Schnopsn</button>
        </div>
      </div>
    </div>
  </div>
  )
}
