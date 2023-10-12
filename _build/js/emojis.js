var target = $("#target");
var emojiCount = emoji.length;
var emojiTags = []

for(var index = 0; index < emojiCount; index++) {
  addEmoji(emoji[index]);
}

function addEmoji(code)
{
  var option = `<option>${code}</option>`
  emojiTags.push(option)
}

$("#emojis-list").html(emojiTags.join(""))
