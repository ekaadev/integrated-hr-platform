import { createApp } from './app'
import { env } from './env'
import { log } from './plugins/logger'

const app = createApp().listen(env.PORT)

log.info(`HRIS API berjalan di http://localhost:${app.server?.port}`)
