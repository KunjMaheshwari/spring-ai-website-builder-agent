/* =====================================================
   CONFIGURATION
===================================================== */

// Your Spring Boot API
const API_URL = "http://localhost:8080/api/chat";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const chatForm =
    document.getElementById("chatForm");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chatMessages =
    document.getElementById("chatMessages");

const characterCount =
    document.getElementById("characterCount");

const chatContainer =
    document.querySelector(".chat-container");

const toast =
    document.getElementById("toast");


/* =====================================================
   CHARACTER COUNTER
===================================================== */

messageInput.addEventListener("input", () => {

    const length =
        messageInput.value.length;

    characterCount.textContent =
        `${length}/1000`;

});


/* =====================================================
   GET CURRENT TIME
===================================================== */

function getCurrentTime() {

    return new Date().toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =====================================================
   SCROLL TO BOTTOM
===================================================== */

function scrollToBottom() {

    setTimeout(() => {

        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: "smooth"
        });

    }, 50);

}


/* =====================================================
   ADD USER MESSAGE
===================================================== */

function addUserMessage(text) {

    const row =
        document.createElement("div");

    row.className =
        "message-row user-row";


    row.innerHTML = `

        <div class="avatar user-avatar">
            You
        </div>

        <div class="message-wrapper">

            <div class="message user-message">
                ${escapeHtml(text)}
            </div>

            <div class="message-time">
                ${getCurrentTime()}
            </div>

        </div>

    `;


    chatMessages.appendChild(row);

    scrollToBottom();

}


/* =====================================================
   ADD BOT MESSAGE
===================================================== */

function addBotMessage(text) {

    const row =
        document.createElement("div");

    row.className =
        "message-row bot-row";


    row.innerHTML = `

        <div class="avatar bot-avatar">
            🍅
        </div>

        <div class="message-wrapper">

            <div class="sender-name">
                Tomato Support
            </div>

            <div class="message bot-message">
                ${escapeHtml(text)}
            </div>

            <div class="message-time">
                ${getCurrentTime()}
            </div>

        </div>

    `;


    chatMessages.appendChild(row);

    scrollToBottom();

}


/* =====================================================
   TYPING INDICATOR
===================================================== */

function showTypingIndicator() {

    const row =
        document.createElement("div");

    row.id =
        "typingIndicator";

    row.className =
        "message-row bot-row";


    row.innerHTML = `

        <div class="avatar bot-avatar">
            🍅
        </div>

        <div class="message-wrapper">

            <div class="sender-name">
                Tomato Support
            </div>

            <div class="message bot-message typing-message">

                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>

            </div>

        </div>

    `;


    chatMessages.appendChild(row);

    scrollToBottom();

}


/* =====================================================
   REMOVE TYPING INDICATOR
===================================================== */

function removeTypingIndicator() {

    const indicator =
        document.getElementById(
            "typingIndicator"
        );

    if (indicator) {

        indicator.remove();

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =====================================================
   SEND MESSAGE
===================================================== */

chatForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const message =
            messageInput.value.trim();


        /* Empty message */

        if (!message) {

            return;

        }


        /* Disable UI */

        messageInput.disabled =
            true;

        sendButton.disabled =
            true;


        /* Display user message */

        addUserMessage(message);


        /* Clear input */

        messageInput.value = "";

        characterCount.textContent =
            "0/1000";


        /* Show typing */

        showTypingIndicator();


        try {

            console.log(
                "Sending message:",
                message
            );


            /*
             * Your Spring Boot controller is:
             *
             * @PostMapping("/chat")
             * public String chat(
             *     @RequestBody String message
             * )
             *
             * Therefore we send plain text.
             */

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain"
                        },

                        body: message
                    }
                );


            console.log(
                "HTTP Status:",
                response.status
            );


            /* HTTP error */

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            /*
             * Your Spring Boot controller
             * returns String.
             */

            const aiResponse =
                await response.text();


            console.log(
                "AI Response:",
                aiResponse
            );


            /* Remove typing */

            removeTypingIndicator();


            /* Show AI response */

            addBotMessage(
                aiResponse
            );


        } catch (error) {

            console.error(
                "Chat API Error:",
                error
            );


            removeTypingIndicator();


            addBotMessage(
                "I'm sorry, I couldn't connect to Tomato Support right now. Please try again."
            );


            showToast(
                "Unable to connect to the server."
            );

        } finally {

            /* Enable UI */

            messageInput.disabled =
                false;

            sendButton.disabled =
                false;


            /* Focus input */

            messageInput.focus();

        }

    }
);


/* =====================================================
   ENTER KEY
===================================================== */

messageInput.addEventListener(
    "keydown",
    (event) => {

        /*
         * Enter sends the message.
         *
         * Shift + Enter can be used later
         * if you want multiline messages.
         */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();

        }

    }
);


/* =====================================================
   INITIAL FOCUS
===================================================== */

window.addEventListener(
    "load",
    () => {

        messageInput.focus();

    }
);