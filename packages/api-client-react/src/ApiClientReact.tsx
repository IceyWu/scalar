import { type ClientRequestConfig, useRequestStore } from '@scalar/api-client'
import React, { useEffect, useState } from 'react'

import { ApiClientReactBase } from './ApiClientReactBase'
import './style.css'

type Props = {
  // Function to close the modal
  close: () => void
  // Controls whether the modal is open or closed
  isOpen: boolean
  // The OpenApi request object
  request: ClientRequestConfig
}

const { setActiveRequest } = useRequestStore()

/**
 * Api Client React
 */
export const ApiClientReact = ({ close, isOpen = false, request }: Props) => {
  useEffect(() => {
    setActiveRequest(request)
  }, [request])

  const [host, setHost] = useState('')
  useEffect(() => setHost(window.location.host), [])

  return (
    <div
      className="scalar"
      style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="scalar-container">
        <div className="scalar-app">
          <div className="scalar-app-header">
            <span>API Client</span>
            <a
              href={`https://www.scalar.com?utm_campaign=${host}`}
              target="_blank">
              Powered by scalar.com
            </a>
          </div>
          <ApiClientReactBase />
        </div>
        <div
          onClick={close}
          className="scalar-app-exit"></div>
      </div>
    </div>
  )
}
