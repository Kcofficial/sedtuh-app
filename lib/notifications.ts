import webpush from 'web-push'
import { prisma } from './db'

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  data?: any
) {
  try {
    // Get user's push tokens
    const pushTokens = await prisma.pushToken.findMany({
      where: { userId }
    })

    if (pushTokens.length === 0) {
      console.log('No push tokens found for user:', userId)
      return
    }

    const notification = {
      title,
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data || {},
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/icon-96x96.png'
        }
      ]
    }

    // Send to all tokens
    const promises = pushTokens.map(async (token) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: token.token,
            keys: {
              p256dh: process.env.VAPID_PUBLIC_KEY!,
              auth: process.env.VAPID_PRIVATE_KEY!
            }
          },
          JSON.stringify(notification)
        )
      } catch (error: any) {
        // If token is invalid, remove it
        if (error.statusCode === 410) {
          await prisma.pushToken.delete({
            where: { id: token.id }
          })
          console.log('Removed invalid push token:', token.id)
        } else {
          console.error('Error sending push notification:', error)
        }
      }
    })

    await Promise.all(promises)

    // Store notification in database
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: 'SYSTEM',
        data: data || {}
      }
    })

    console.log('Push notification sent successfully to user:', userId)
  } catch (error) {
    console.error('Error in sendPushNotification:', error)
  }
}

export async function sendOrderNotification(
  userId: string,
  orderType: 'NEW_ORDER' | 'ORDER_STATUS' | 'PAYMENT',
  orderData: any
) {
  const { type, status, orderNumber } = orderData

  let title = ''
  let message = ''

  switch (orderType) {
    case 'NEW_ORDER':
      title = 'New Order Received!'
      message = `Order ${orderNumber} is waiting for acceptance`
      break
    case 'ORDER_STATUS':
      title = 'Order Status Update'
      message = `Order ${orderNumber} is now ${status}`
      break
    case 'PAYMENT':
      title = 'Payment Confirmation'
      message = `Payment for order ${orderNumber} has been received`
      break
  }

  await sendPushNotification(userId, title, message, {
    type: orderType,
    orderData
  })
}

export async function sendDriverNotification(
  driverId: string,
  type: 'NEW_ORDER' | 'ORDER_ASSIGNED',
  orderData: any
) {
  let title = ''
  let message = ''

  switch (type) {
    case 'NEW_ORDER':
      title = 'New Order Available!'
      message = `A new order is available near you`
      break
    case 'ORDER_ASSIGNED':
      title = 'Order Assigned'
      message = `You have been assigned to order ${orderData.orderNumber}`
      break
  }

  await sendPushNotification(driverId, title, message, {
    type,
    orderData
  })
}
