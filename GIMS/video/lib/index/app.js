// adding a button to the player
var player = videojs('player', {
    height: 600,
    width: 900,
    controlBar: {
        volumePanel: {
            inline: false
        },
    }
}, function () {
    console.log(this);
});