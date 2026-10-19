import { createApp } from './app'
import { env } from './env'
import { log } from './plugins/logger'

const app = createApp().listen(env.PORT)

log.info(`LMS/Training API berjalan di http://localhost:${app.server?.port}`)
