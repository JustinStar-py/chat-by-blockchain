import {selectedAccount as address, isConnected, web3, contract} from "./walletConnect.js"

let messages = null;
let contacts = null;
let currectContact = null;
let isInitialidCurrectContact = false;
let isLoading = false;
let newContacts = [];

function Timestamp2Date(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedTimestamp = `${month}/${day} ${hours}:${minutes}`;
  return formattedTimestamp;
}

function changeCurrectContact(key) {
  currectContact = key;
}

 async function sendMessageFunc() {
    let sendMessage = $("#message-input").val()
    
    if (!sendMessage || !currectContact) {
      return; // Don't send empty messages or without a valid contact
    }

    try {
      isLoading = true
      const data = await contract.methods.sendMessage(currectContact, sendMessage).encodeABI()

      let transactionObject = {
        from: address,
        to: "0xa0b09cbEf5416677e325019424b77de2206CE76A",
        data: data,
        gas:""
      };

      const gasLimit = await web3.eth.estimateGas(transactionObject)  
      transactionObject["gas"] = parseInt(gasLimit);
     
        if (isLoading) {
          await web3.eth.sendTransaction(transactionObject) 
          .on("receipt", (receipt) => {
              isLoading = false
              $("#message-input").prop("value","")
          });
      } 
    
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

async function getMessagesList() { 
  if (isConnected) {
    messages = await contract.methods.getMessagesForAddress(address).call()
    getContactsList()
  }
}

function getContactsList() {
  if (messages !== null) {
    const uniqueAddresses = new Set();
    
    newContacts.map((newContact) => {
       uniqueAddresses.add(newContact)
    })
    
    messages.forEach((val) => {
      uniqueAddresses.add(val["_from"]);
      uniqueAddresses.add(val["_to"]);
    });
        
    uniqueAddresses.delete(address)
    contacts = Array.from(uniqueAddresses); // Convert Set back to an array
    const contactsTags = [];

    for (let num = 0; num < contacts.length; num++) {
      const tag = `
        <div class="custom-chip contact m-1 ${newContacts.includes(contacts[num])? "bg-purple" : ''}" key="${contacts[num]}">
          <svg viewBox="0 0 24 24" data-testid="FaceIcon">
            <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"></path>
          </svg>
          <span>${`User ${contacts[num].slice(0, 7)}...${contacts[num].slice(37, 42)}`} ${newContacts.includes(contacts[num])? "<p class='text-warning' id='added-text'> Added </p>" : ""}</span>
        </div>
      `;
      contactsTags.push(tag);
    }
    
    let createBtn = `<div class="custom-chip m-1 bg-info text-light" id="create-btn">
      <svg viewBox="0 0 24 24" data-testid="FaceIcon">
        <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
      </svg>
       create chat
    </div>`

    $("#contactList").html(contactsTags.join("") + createBtn);
    $(".contact").click(function () { 
        changeCurrectContact($(this).attr("key"))
    })

    $("#create-btn").click(function () { 
      $('#create-chat-modal').modal('show') 
    });

    $("#emoji-btn").click(function () { 
      $('#emoji-modal').modal('show') 
    });
    
    if (!isInitialidCurrectContact) {
      currectContact = contacts[0]
      isInitialidCurrectContact = true;
    }

    fetchMessages()
  }
}

function fetchMessages() {
  if (contract && isConnected && currectContact !== null) {
    const sortMessagesList = [];
    messages.forEach((val) => {
      if (val._from === address && val._to === currectContact) {
        sortMessagesList.push({
          "type": "sent",
          "text": val._message,
          "time": Timestamp2Date(parseInt(val._time)) 
        });
      } else if (val._from === currectContact && val._to === address) {
        sortMessagesList.push({
          "type": "received",
          "text": val._message,
          "time": Timestamp2Date(parseInt(val._time))
        });
      }
    });
    
    let messageTags = [];
    sortMessagesList.map((val, index) => {
      let tag = `<div key=${index} class="message ${val.type === "received" ? "their" : "my"}-message">
       ${val.type === "sent" ? 
            `<div class="msg-chip bg-primary ${val.type}-chip">
                <span class="label">${val.text}</span>
                <p class="time text-dark opacity-half">
                  <span>${val.time}</span>
                  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DoneAllIcon" aria-label="fontSize small"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path></svg>                </p>
          </div>`
         : 
            `<div class="msg-chip bg-info">
                <span class="label">${val.text}</span>
                <p class="time text-dark opacity-half">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DoneAllIcon" aria-label="fontSize small"><path d="m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z"></path>
                    </svg>               
                    <span>${val.time}</span>
                 </p>
          </div>`
        }
      </div>`
     messageTags.push(tag)
      })
      $(".chat-box").html(messageTags.join(""))
  }
}

$("#send-msg-btn").click(function () { 
  $("#send-msg-btn").attr('disabled', 'disabled'); 
  sendMessageFunc().then(() => { 
    $("#send-msg-btn").removeAttr('disabled');
  })
});

$("#create-chat").click(function () {
    let newContactAddress = web3.utils.toChecksumAddress($("#contact-input").val())
    newContacts.push(newContactAddress)
    $("#create-chat-modal").modal("hide") 
    $("#contact-input").prop("value",'')
})

$("#emojis-list option").click(function() {
   var text = $("#message-input").val()
   $(this).css('background', 'orange')
   $("#message-input").val(text + $(this).text())
})

$(".close").click(function () { 
  $('.modal').modal('hide') 
})

window.addEventListener('DOMContentLoaded', () => {
    setInterval(async function () { 
        await getMessagesList()
    }, 1500, isConnected)
    // setTimeout(async function () { 
    //   await getMessagesList()
    //  }, 3000)
});
