// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Payment {
    struct Message {
        address _from;
        address _to;
        string _message;
        uint256 _time;
    }

    Message[] public allMessages;
    event messageEvent(address indexed _from, address _to, string _message ,uint256 _timestamp);

    function sendMessage(address _to, string memory _message) public returns (bool) {
        allMessages.push(Message(msg.sender, _to, _message, block.timestamp));
        emit messageEvent(msg.sender, _to, _message, block.timestamp);
        return true;
    }

    function getMessagesForAddress(address _address) public view returns (Message[] memory) {
        uint256 messageCount = 0;

        // Count the number of messages for the given address
        for (uint256 i = 0; i < allMessages.length; i++) {
            if (allMessages[i]._to == _address || allMessages[i]._from == _address) {
                messageCount++;
            }
        }

        // Create an array to store messages for the given address
        Message[] memory messages = new Message[](messageCount);

        // Populate the messages array with messages for the given address
        uint256 index = 0;
        for (uint256 i = 0; i < allMessages.length; i++) {
            if (allMessages[i]._to == _address || allMessages[i]._from == _address) {
                messages[index] = allMessages[i];
                index++;
            }
        }
        return messages;
    }

    function getAllMessages() public view returns (Message[] memory) {
        return allMessages;
    }
}