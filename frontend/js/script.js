// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const ChatForm = chat.querySelector(".chat__form")
const ChatInput = chat.querySelector(".chat__input")
const ChatMessages = chat.querySelector(".chat__messages")

const onlineCount = document.getElementById("onlineCount")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id:"", name:"", color:"" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message__self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const text = document.createElement("p")

    div.classList.add("message__other")

    span.classList.add("message__sender")
    span.style.color = senderColor
    span.innerText = sender

    text.innerText = content

    div.appendChild(span)
    div.appendChild(text)

    return div
}

const createMessageSystemElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message__system")
    div.innerHTML = content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {

    const message = JSON.parse(data)

    // contador online
    if (message.type === "online") {
        const onlineCount = document.getElementById("onlineCount")
        onlineCount.innerText = message.count
        return
    }

    const { userId, userName, userColor, content } = message

    let element

    // mensagem do sistema
    if (userId === "system") {
        element = createMessageSystemElement(content)
    }

    // mensagem do próprio usuário
    else if (userId === user.id) {
        element = createMessageSelfElement(content)
    }

    // mensagem de outro usuário
    else {
        element = createMessageOtherElement(content, userName, userColor)
    }

    ChatMessages.appendChild(element)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-text-backend.onrender.com")

    websocket.onmessage = processMessage

    websocket.onopen = () => {

        const message = {
            userId: "system",
            userName: "system",
            userColor: "#999",
            content: `${user.name} entrou no chat`
        }

        websocket.send(JSON.stringify(message))
    }
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: ChatInput.value
    }

    websocket.send(JSON.stringify(message))

    ChatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
ChatForm.addEventListener("submit", sendMessage)