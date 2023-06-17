import { useContext, useState, useRef, useEffect } from 'react'

import UtilToastProgressBarComponent from './toast-progress-bar.component'

import { ToastContext } from '../../../Contexts/contexts.contexts'

import './toast.styles.sass'

const UtilToastComponent = () => {
  const [ toast, setToast ]         = useContext(ToastContext)

  let [ seconds, setSeconds ]       = useState(4)
  const [ isPaused, setPaused ]     = useState(false)

  const toastElement                = useRef(null)

  let interval                      = null

  const timer                       = () => {
    toastElement.current.classList.add('counting--down')

    interval                        = window.setInterval(() => {
      console.log(seconds)

      if(seconds > 0 && isPaused) window.clearInterval(interval)
      else if(seconds > 0 && !isPaused) setSeconds(--seconds)
      else {
        setSeconds(4)
        setToast({ message: null })

        toastElement.current.classList.remove('counting--down')

        window.clearInterval(interval)
      }
    }, 1000)
  }

  useEffect(() => {
    if(toast.message) timer()

    return () => window.clearInterval(interval)
  }, [ toast.message, isPaused ])

  return (
    <>
      { toast.message && (
        <div
          className={ `util__toast__component component
          ${ !toast.error && !toast.success ? 'default' : '' }
          ${ toast.error ? 'error' : '' }
          ${ toast.success ? 'success' : '' }` }
          onMouseOver={ () => setPaused(true) }
          onMouseOut={ () => setPaused(false) }
          ref={ toastElement }>
          <div className='util__toast__component__container component__container'>
            <span className='util__toast__message'>{ toast.message }</span>
          </div>
          <UtilToastProgressBarComponent />
        </div>
      ) }
    </>
  )
}

export default UtilToastComponent