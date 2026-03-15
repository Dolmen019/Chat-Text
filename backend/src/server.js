const { WebSocketServer } = require("ws")

const wss = new WebSocketServer({ port: 8080 })

function sendOnlineCount() {
    const online = wss.clients.size

    const message = JSON.stringify({
        type: "online",
        count: online
    })

    wss.clients.forEach(client => {
        client.send(message)
    })
}

wss.on("connection", (ws) => {

    console.log("Novo cliente conectado")

    sendOnlineCount()

    ws.on("message", (data) => {

        wss.clients.forEach(client => {
            client.send(data.toString())
        })

    })

    ws.on("close", () => {

        console.log("Cliente saiu")

        sendOnlineCount()

    })
})