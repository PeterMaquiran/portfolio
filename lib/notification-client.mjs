export class NotificationClientError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode]
   * @param {any} [responseData]
   */
  constructor(message, statusCode, responseData) {
    super(message)
    this.name = 'NotificationClientError'
    this.statusCode = statusCode
    this.responseData = responseData
  }
}

export class NotificationClient {
  /**
   * @param {string} baseUrl
   */
  constructor(baseUrl = 'http://172.19.0.35:3000') {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  /**
   * Private helper for making HTTP requests.
   * @param {string} endpoint
   * @param {RequestInit} [options={}]
   */
  async #request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new NotificationClientError(
          data.error || `HTTP error ${response.status}: ${response.statusText}`,
          response.status,
          data,
        )
      }

      return data
    } catch (error) {
      if (error instanceof NotificationClientError) {
        throw error
      }
      throw new NotificationClientError(
        error instanceof Error ? error.message : 'Network request failed',
      )
    }
  }


  /**
   * Send a direct notification to a specific device token.
   * @param {Object} payload
   * @param {string} payload.token
   * @param {string} payload.title
   * @param {string} payload.body
   * @param {string} [payload.image]
   * @param {string} [payload.url]
   * @param {string} [payload.badge]
   */
  async sendNotification(payload) {
    return this.#request('/api/v1/notifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Subscribe a device token to a topic.
   * @param {Object} payload
   * @param {string} payload.token
   * @param {string} payload.topic
   */
  async subscribeToTopic(payload) {
    return this.#request('/api/v1/topics/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Broadcast a notification to a specific topic or the default topic.
   * @param {Object} payload
   * @param {string} payload.title
   * @param {string} payload.body
   * @param {string} payload.image
   * @param {string} payload.url
   * @param {string} [payload.topic]
   * @param {string} [payload.badge]
   */
  async broadcastNotification(payload) {
    return this.#request('/api/v1/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

}
