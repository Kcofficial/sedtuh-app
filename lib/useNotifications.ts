'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function useNotifications() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
    }
  }, [])

  const subscribe = async () => {
    if (!isSupported || !session) return

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })

      setSubscription(subscription)

      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: JSON.stringify(subscription),
          platform: 'web'
        })
      })

      console.log('Push notification subscription successful')
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return

    try {
      await subscription.unsubscribe()
      
      // Remove subscription from backend
      await fetch('/api/notifications/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: JSON.stringify(subscription)
        })
      })

      setSubscription(null)
      console.log('Push notification unsubscription successful')
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  return {
    isSupported,
    subscription,
    subscribe,
    unsubscribe,
    requestPermission
  }
}

// Helper function to convert VAPID key
function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
