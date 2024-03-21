const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const port = 3333;

let i=1000;
let games=[];
let wordList = ['country', 'fruits', 'sports', 'makeup', 'animals', 'weapons', 'sand', "fruit juice"];
let underList = ['flags', 'vegetables', 'races', 'beauty', 'insects', 'swords', 'beach', 'water'];
let prevgameids=[]


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



app.post('/submit', (req, res) => {
    console.log('POST request arrived');
    const playerName = req.body.username;
    const gameCode = req.body.code;
    const playerNum = req.body.num;
    let gameIndex= -1;
    const newPlayer = {
        name: playerName,
      word: '',
      game: 0
  };
  if (gameCode) {
    gameIndex = games.findIndex(game => game.code == gameCode);
    if (gameIndex !== -1) {
        games[gameIndex].numPlayers++;
        games[gameIndex].players.push(newPlayer);
        newPlayer.game=parseInt(gameCode);
        console.log(`Player '${playerName}' joined game ${gameCode}`);
        res.cookie("game",gameCode,{maxAge:30000})
      }}
  if (playerNum){
    let newGame={
        code:++i,
        maxPlayers:parseInt(playerNum),
        numPlayers:1,
        players:[newPlayer]
    }
    newPlayer.game=i;
    games.push(newGame);
    console.log(`player ${playerName}created a game id: ${i}`)
    res.cookie("game",newGame.code,{maxAge:120000})
  }
    res.cookie('username', playerName, {maxAge: 120000 });


    if ((gameCode)&&(gameIndex==-1)){
        console.log("erreur 400")
        res.status(400).send()
    }
else{    res.status(200).send()}
  
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
    res.cookie("start",false,{maxAge:120000})
    res.sendFile(path.join(__dirname, "dist", "index.html"));
    clear
});

app.listen(port, () => {
    console.log(`Undercover est sur le port : ${port}`);
});


app.get('/update-cookie', (req, res) => {

  games.forEach((game)=>{
    if (game.maxPlayers==game.numPlayers){
      if(req.cookies.game==game.code){
        assignRoles(game.code)
        game.players.forEach((player)=> {
          if (player.name==req.cookies.username){
          res.cookie("word",player.word,{maxAge:120000})
        }})
        res.cookie("start",true,{maxAge:12000})
        res.status(200).send()
        }
      }})
    }
  )




function assignRoles(gameid) {
  if (!prevgameids.includes(gameid)) {
  games.forEach((game)=>{if (game.code==gameid){
 const j = Math.floor(Math.random() * underList.length);
  const k = Math.floor(Math.random() * game.players.length);
  const undercoverWord = underList[j];
  const civilianWord = wordList[j];
    game.players.forEach((player,i)=>{
      if (i===k)
  {player.word= undercoverWord}
  else{player.word=civilianWord}
    })
  }
  });
  prevgameids.push(gameid);}
}
let voted=[]
// socket.io
const io = require('socket.io')(port+1,{cors: {origin: "*" }});
io.on('connection', (socket) => {
  const gameRoom = socket.handshake.query.game
  const gameUser =socket.handshake.query.username
  socket.join(gameRoom);
  socket.on('chat message', (msg) => {
    if(msg.includes('/vote')){
      games.forEach((game)=>{
        if (game.code==gameRoom){
          game.players.forEach((player)=>{
            let whovoted=msg.replace("/vote"+playername,"")
            if (msg.includes("/vote"+player.name)&& !voted.includes(whovoted)){
              player.vote++
              if()
            io.to(gameRoom).emit('chat message', "Someone voted"+player.name)}})
          }})
        }
      
    else{
      console.log('Message:', msg);
      io.to(gameRoom).emit('chat message', msg); 
    }
  });

  
  socket.on('disconnect', () => {
  });
});
