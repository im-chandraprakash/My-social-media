import React from 'react'
import userImage from '../../Assets/user.png';
import './Avatar.scss'
function Avatar({src}) {
  return (
    <div className='Avatar'>
        <img src={src ? src : userImage} alt="" />
    </div>
  )
}

export default Avatar