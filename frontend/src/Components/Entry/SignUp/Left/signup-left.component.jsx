import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaEnvelope, FaUserAlt } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'
import axios from 'axios'

import FormComponent from '../../../Form/form.component'
import FormTitleComponent from '../../../Form/title.component'
import FormInputComponent from '../../../Form/input.component'
import FormButtonComponent from '../../../Form/button.component'
import FormSuccessComponent from '../../../Form/success.component'

import { ApiURI } from '../../../../Configs/mode.config'

const SignUpLeftComponent = () => {
  const [ formData, setFormData ]       = useState({ email: '', username: '', password: '' })
  const [ success, setSuccess ]         = useState({ success: null, message: null })
  const [ error, setError ]             = useState({ error: null, message: null })

  const handleSignUp                    = (e) => {
    e.preventDefault()

    axios.post(ApiURI + '/User/', formData)
      .then((response) => {
        console.log(response)

        setError({ error: null, message: null })
        setSuccess({ success: response.data.success, message: response.data.message })
      })
      .catch((error) => {
        console.error(error)

        setSuccess({ success: null, message: null })
        setError({ error: error.response.data.error, message: error.response.data.message })
      })
  }

  return (
    <>
      <div className='signup__left__component entry__left__component component'>
        <div className='signup__left__component__container entry__left__component__container component__container'>
          <FormComponent
            handleOnSubmit={ handleSignUp }
            formData={ formData }
            setFormData={ setFormData }>
              <FormTitleComponent
                h1='Welcome!'
                footnoteText='Please enter your desired details.' />
              <FormInputComponent
                id='SignUpEmail'
                labelText='Email'
                icon={ <FaEnvelope /> }
                type='email'
                name='email'
                placeholder='Enter your email'
                error={ error.error === 'email' ? error : null } />
              <FormInputComponent
                id='SignUpUsername'
                labelText='Username'
                icon={ <FaUserAlt /> }
                type='username'
                name='username'
                placeholder='Enter your desired username'
                error={ error.error === 'username' ? error : null } />
              <FormInputComponent
                id='SignUpPassword'
                labelText='Password'
                icon={ <MdPassword /> }
                type='password'
                name='password'
                placeholder='Enter your desired password'
                error={ error.error === 'password' ? error : null } />
              <FormInputComponent
                id='SignUpConfirmPassword'
                labelText='Confirm Password'
                icon={ <MdPassword /> }
                type='password'
                name='confirmPassword'
                placeholder='Repeat your password'
                error={ error.error === 'confirmPassword' ? error : null } />
              <FormSuccessComponent
                success={ success } />
              <FormButtonComponent
                buttonText='Sign up'
                disabled={ !formData.email || !formData.username || !formData.password }
                style={{ marginTop: 'var(--unit-4)' }} />
              <div className='entry__left__entry__link'>
                <div className='entry__left__entry__link__container'>
                  <span>Already got an account? <NavLink to='/login'>Log in</NavLink></span>
                </div>
              </div>
            </FormComponent>
        </div>
      </div>
    </>
  )
}

export default SignUpLeftComponent