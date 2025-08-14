import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { errorToast } from '@/lib/toast'
import { getCookie } from './utils'

// Create a reusable axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.baseUrl}`,
  headers: {
    Accept: '*',
    Authorization: undefined,
    'User-Agent': undefined,
    'Content-Type': 'application/json'
  }
})

type APIOptions = AxiosRequestConfig & {
  showToaster?: boolean
  params?: Record<string, any>
  body?: Record<string, any>
}

// this function replaces each ${cookieName} with the actual cookie value (in order to avoid accessing cookies on each request)
const optimizeUrl = (url: string): string =>
  url.replace(/\$([\w.-]+)/g, (_, name) =>
    encodeURIComponent(Cookies.get(name) || '')
  )

export const api = async function (
  url: string,
  options: APIOptions = { showToaster: true }
) {
  try {
    // Add token manually
    const token = getCookie('tp.access-token')

    const res = await axiosInstance.request({
      
      url: optimizeUrl(url),
      method: options.method || 'GET',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      },
      params: options.params, // Axios handles URLSearchParams internally
      data: options.body, // Axios uses `data` instead of `body`
    })

    return res?.data
  } catch (err: any) {
    const status = err?.response?.status
    const message = err?.response?.data?.message || 'Something went wrong'

    if (status === 401 && window?.location?.pathname !== '/auth/login') {
      // clear credentials
      Cookies.remove('tp.access-token')

      // redirect to login page
      window.location.replace('/login')
    }

    if (options.showToaster !== false) {
      errorToast(message)
    }

    throw err
  }
}
