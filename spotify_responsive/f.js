//  ("anu")
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutes(seconds) {

   if (isNaN(seconds) || seconds < 0) {


      return "wait...."
   }


   var minutes = Math.floor(seconds / 60);



   var remainingSeconds = Math.floor(seconds % 60);

   var formattedMinutes = String(minutes).padStart(2, '0');
   var formattedSeconds = String(remainingSeconds).padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds}`;
}





async function getsongs(folder) {
   currFolder = folder;
   let a = await fetch(`/${folder}/`);
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response;
   let as = div.getElementsByTagName("a")
   songs = []
   //  (as)
   for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split(`/${folder}/`)[1])
      }
   }

   // show all the song in the pplay list
   let songul = document.querySelector('.songslist').getElementsByTagName("ul")[0]
   songul.innerHTML = ""
   for (const song of songs) {
      songul.innerHTML = songul.innerHTML + `<li><img class="invert" width="22" src="music.svg" alt="">
     <div class="info">
         <div> ${decodeURI(song.replace(/%20/g, " "))}</div>
         <div>anu</div>
     </div>
     <div class="playnow">
         <span>Play Now</span>
         <img class="invert" src="17624816851535958156.svg" alt="">
     </div> </li>`;
   }
   //event listener to play each song
   Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element => {
         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })



   })
   // // (songs)
   return songs
}
const playMusic = (track, pause = false) => {
   currentsong.src = `/${currFolder}/` + track
   if (!pause) {

      currentsong.play()
      plays.src = "211871_pause_icon.svg"

   }
   document.querySelector(".songinfo").innerHTML = decodeURI(track)

   document.querySelector(".songtime").innerHTML = "  ";


}
async function displayAlbums() {
   
   let a = await fetch(`/songs/`)
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response;
   let anchors = div.getElementsByTagName("a")
   let cardContainer = document.querySelector(".cardcontainer")
   let array=  Array.from(anchors)

   for (let index = 0; index < array.length; index++) {

   
   const e = array[index];
   
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
         if (e.href.includes("/songs/")) {


            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            // console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
            </div>`
         }
      }
      
   
   }
   Array.from(document.getElementsByClassName("card")).forEach(e => {
      e.addEventListener("click", async item => {
         console.log("Fetching Songs")
         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
         playMusic(songs[0])

      })

   })
}
async function main() {

   await getsongs("songs/tai_verdes")

   playMusic(songs[0], true)

   displayAlbums();
   plays.addEventListener("click", () => {
      if (currentsong.paused) {
         currentsong.play()
         plays.src = "211871_pause_icon.svg"

      }
      else {

         currentsong.pause()
         plays.src = "17624816851535958156.svg"
      }
   })

   currentsong.addEventListener("timeupdate", () => {
      document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`;


      document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

   }
   )
   document.querySelector(".seekbar").addEventListener("click", e => {

      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentsong.currentTime = ((currentsong.duration) * percent) / 100
   })
   document.querySelector(".hamburger").addEventListener(("click"), () => {
      document.querySelector(".left").style.left = "0"

   }
   )
   document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-120%"
   })
   previous.addEventListener("click", () => {
      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

      if ((index - 1) >= 0) {
         playMusic(songs[index - 1])


      }
   })
   next.addEventListener("click", () => {
      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])


      if ((index + 1) < songs.length) {


         playMusic(songs[index + 1])
      }
   })
   document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
let logos = document.querySelector(".volume>img")
      console.log("setting volume to" + e.target.value + "/100")
      currentsong.volume = parseInt(e.target.value) / 100
       logos.src="volume.svg"

   })
   document.querySelector(".volume>img").addEventListener("click", e=>{ 
      if(e.target.src.includes("volume.svg")){
          e.target.src = e.target.src.replace("volume.svg", "mute-svgrepo-com.svg")
          currentsong.volume = 0;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
          e.target.src = e.target.src.replace("mute-svgrepo-com.svg", "volume.svg")
          currentsong.volume = .10;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      }
         
  })
  
}

main();




