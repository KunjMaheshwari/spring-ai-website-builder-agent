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

    }, 30);

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
   CREATE BOT MESSAGE
===================================================== */

function createBotMessage() {

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

            <div
                class="message bot-message"
                aria-live="polite"
            ></div>

            <div class="message-time">
                ${getCurrentTime()}
            </div>

        </div>

    `;


    chatMessages.appendChild(row);

    scrollToBottom();


    return row.querySelector(
        ".bot-message"
    );

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
   STREAM AI RESPONSE
===================================================== */

async function streamResponse(
    response,
    messageElement
) {

    /*
     * Make sure the browser received
     * a readable response body.
     */

    if (!response.body) {

        throw new Error(
            "Response body does not support streaming."
        );

    }


    /*
     * Get the stream reader.
     */

    const reader =
        response.body.getReader();


    /*
     * Decoder converts incoming
     * bytes into UTF-8 text.
     */

    const decoder =
        new TextDecoder("utf-8");


    let fullResponse = "";


    console.log(
        "🚀 AI response streaming started"
    );


    /*
     * Read the response chunk by chunk.
     */

    while (true) {

        const {
            value,
            done
        } = await reader.read();


        /*
         * Stream is finished.
         */

        if (done) {

            break;

        }


        /*
         * Convert received bytes
         * into text.
         */

        const chunk =
            decoder.decode(
                value,
                {
                    stream: true
                }
            );


        console.log(
            "📦 Received chunk:",
            JSON.stringify(chunk)
        );


        /*
         * Ignore empty chunks.
         */

        if (!chunk) {

            continue;

        }


        /*
         * Add the new chunk to
         * the complete response.
         */

        fullResponse += chunk;


        /*
         * Update the message immediately.
         */

        messageElement.textContent =
            fullResponse;


        /*
         * Give the browser an opportunity
         * to paint the updated message.
         */

        await new Promise(resolve => {

            requestAnimationFrame(resolve);

        });


        /*
         * Keep the latest response visible.
         */

        scrollToBottom();

    }


    /*
     * Flush any remaining bytes
     * from the decoder.
     */

    const remaining =
        decoder.decode();


    if (remaining) {

        fullResponse +=
            remaining;

        messageElement.textContent =
            fullResponse;

    }


    console.log(
        "✅ AI response streaming completed"
    );


    return fullResponse;

}


/* =====================================================
   SEND MESSAGE
===================================================== */

chatForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* ---------------------------------------------
           GET USER MESSAGE
        --------------------------------------------- */

        const message =
            messageInput.value.trim();


        /*
         * Don't send empty messages.
         */

        if (!message) {

            return;

        }


        /* ---------------------------------------------
           DISABLE UI
        --------------------------------------------- */

        messageInput.disabled =
            true;

        sendButton.disabled =
            true;


        /* ---------------------------------------------
           DISPLAY USER MESSAGE
        --------------------------------------------- */

        addUserMessage(message);


        /* ---------------------------------------------
           CLEAR INPUT
        --------------------------------------------- */

        messageInput.value =
            "";

        characterCount.textContent =
            "0/1000";


        /* ---------------------------------------------
           SHOW TYPING INDICATOR
        --------------------------------------------- */

        showTypingIndicator();


        try {

            console.log(
                "📤 Sending message:",
                message
            );


            /* =========================================
               CALL SPRING BOOT API
            ========================================= */

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "text/plain",

                            /*
                             * Backend is returning a
                             * streamed text response.
                             */
                            "Accept":
                                "text/plain"

                        },

                        body:
                        message
                    }
                );


            /* =========================================
               LOG RESPONSE
            ========================================= */

            console.log(
                "HTTP Status:",
                response.status
            );


            console.log(
                "Response Content-Type:",
                response.headers.get(
                    "content-type"
                )
            );


            /* =========================================
               CHECK HTTP ERROR
            ========================================= */

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            /* =========================================
               REMOVE TYPING INDICATOR
            ========================================= */

            removeTypingIndicator();


            /* =========================================
               CREATE EMPTY BOT MESSAGE
            ========================================= */

            const messageElement =
                createBotMessage();


            /* =========================================
               START STREAMING
            ========================================= */

            const aiResponse =
                await streamResponse(
                    response,
                    messageElement
                );


            console.log(
                "🤖 Complete AI response:",
                aiResponse
            );

        }


            /* =============================================
               ERROR HANDLING
            ============================================= */

        catch (error) {

            console.error(
                "❌ Chat API Error:",
                error
            );


            /*
             * Remove typing indicator.
             */

            removeTypingIndicator();


            /*
             * Display error message.
             */

            addBotMessage(
                "I'm sorry, I couldn't connect to Tomato Support right now. Please try again."
            );


            /*
             * Display toast.
             */

            showToast(
                "Unable to connect to the server."
            );

        }


            /* =============================================
               RE-ENABLE UI
            ============================================= */

        finally {

            messageInput.disabled =
                false;

            sendButton.disabled =
                false;


            /*
             * Focus input again.
             */

            messageInput.focus();

        }

    }
);


/* =====================================================
   ADD BOT MESSAGE
   Used for error messages and
   non-streaming messages.
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
   ENTER KEY
===================================================== */

messageInput.addEventListener(
    "keydown",
    (event) => {

        /*
         * Enter sends the message.
         *
         * Shift + Enter can be used
         * for multiline messages.
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