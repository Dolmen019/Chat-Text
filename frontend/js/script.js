// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const ChatForm = chat.querySelector(".chat__form")
const ChatInput = chat.querySelector(".chat__input")
const ChatMessages = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id:"", name:"", color:""}

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

const processMessage = ({data}) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)

    ChatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"
    
    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

    // websocket.onopen = () => 
    //     websocket.send(`Usuario: ${user.name} entrou no chat`)

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