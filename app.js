const express = require('express')
const http = require('http')
const cookieParser = require('cookie-parser')
const socketio = require('socket.io')
const { Gpio } = require('pigpio');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const server = http.createServer(app)

const GPIO_PINS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

GPIO_PINS.forEach((pin) => new Gpio(pin, { mode: Gpio.OUTPUT }))

socketio(server).on('connection', (socket) => {
    ['pwmWrite', 'pwmFrequency', 'hardwarePwmWrite', 'servoWrite', 'digitalWrite'].forEach((item) => {
        socket.on(item, ({ pin, data }) => {
            GPIO_PINS.includes(pin) && gpio[pin][item](data)
        })
    })
})

server.listen(3210)