import React from 'react'
import SocialButton from '../../atoms/Buttons/SocialButton/SocialButton'
import {faLinkedinIn, faGithubAlt, faFacebook} from '@fortawesome/free-brands-svg-icons'

const SocialLinks = () => {
  return (
    <div className='flex justify-center space-x-3'>
        <SocialButton icon={faLinkedinIn} url="https://www.linkedin.com/in/jorgelhd94/" colorClass='text-black'/>
        <SocialButton icon={faGithubAlt} url="https://github.com/jorgelhd94" colorClass='text-black'/>
        <SocialButton icon={faFacebook} url="https://www.facebook.com/jorgelhd94" colorClass='text-black'/>
    </div>
  )
}

export default SocialLinks