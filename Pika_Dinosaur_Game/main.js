// --------------------------------------------------
// 캔버스 크기 고정 (748 × 224)
// --------------------------------------------------
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width  = 748;
canvas.height = 224;

// --------------------------------------------------
// 이미지 로드
// --------------------------------------------------
const bg__3 = new Image(); bg__3.src = 'bg__3.png';    // 통합된 배경 이미지
//const bg2    = new Image(); bg2.src    = 'bg2.png';       // 배경2
const ground = new Image(); ground.src = 'ground.png';    // 땅(원본 748×224 가정)
const pika1  = new Image(); pika1.src  = 'pika.png';      // 피카츄(오른발)
const pika2  = new Image(); pika2.src  = 'pika2.png';     // 피카츄(왼발)
const poke   = new Image(); poke.src   = 'poke_ball.png'; // 장애물

// --------------------------------------------------
let bgOffset = 0;       // 배경 스크롤 위치
const bgSpeed = 1;      // 배경 이동 속도
const BG_WIDTH = 748;   // 배경 이미지 폭
const BG_HEIGHT = 224;  // 배경 이미지 높이

function drawBackground(offset) {
  // 전체 이미지가 보이도록 위치 계산 수정
  let x = -(offset % BG_WIDTH);
  
  // 현재 화면에 보이는 첫 번째 이미지
  ctx.drawImage(bg__3, x, 0);
  
  // 다음 이미지는 첫 번째 이미지가 완전히 지나간 후에만 그리기
  if (x + BG_WIDTH <= canvas.width) {
      ctx.drawImage(bg__3, x + BG_WIDTH, 0);
  }

}


// --------------------------------------------------
// 땅(ground.png)을 50×33로 잘라 “가로로” 무한 타일링
//     - 하단에 붙여서 “세로 33px”만큼만 땅으로 사용
// --------------------------------------------------
let groundOffset = 0; // 땅 스크롤 위치
const groundSpeed = 5;
const TILE_W = 50;
const TILE_H = 30;

function drawGroundTiling(offset) {
    const modX = offset % TILE_W;
    const startY = canvas.height - TILE_H;
    const tilesNeeded = Math.ceil(canvas.width / TILE_W) + 2;  // 필요한 타일 개수 + 여유분

    // 타일 이미지를 연속해서 그리기
    for (let i = 0; i < tilesNeeded; i++) {
        const drawX = (i * TILE_W) - modX;
        
        ctx.drawImage(
            ground,
            0, 0, TILE_W, TILE_H,  // 원본에서 타일 크기만큼만 잘라서
            drawX, startY, TILE_W, TILE_H  // 타일 크기로 그리기
        );
    }
}

// --------------------------------------------------
//  캐릭터(피카츄) - 왼발/오른발 번갈아 그림
// --------------------------------------------------
const pika = {
  x: 100,
  y: 165,       // 땅(y=191) 위에 올려둔다고 가정(캐릭터 높이 40이면 151 정도가 바닥)
  width: 40,
  height: 40,
  frame: 0,
  isJumping: false,
  jumpCount: 0,
  draw(){
    this.frame++;
    // 20프레임 주기로 pika1/pika2 번갈이
    const curImg = (this.frame % 20 < 10) ? pika1 : pika2;
    ctx.drawImage(curImg, this.x, this.y, this.width, this.height);
  }
};

// --------------------------------------------------
// 장애물(포켓몬볼)
// --------------------------------------------------
class Cactus {
  constructor(){
    this.x = canvas.width + 20; // 오른쪽 바깥에서 시작
    this.y = 170;               // 피카츄 높이와 비슷하게
    this.width  = 30;
    this.height = 30;
  }
  draw() {
    ctx.drawImage(poke, this.x, this.y, this.width, this.height);
  }
}
const cactusList = [];

// --------------------------------------------------
// 충돌 체크 (직사각형)
// --------------------------------------------------
function isCollision(a, b){
  return !(
    a.x + a.width  < b.x ||
    b.x + b.width  < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

// --------------------------------------------------
// 메인 게임 루프
// --------------------------------------------------
let frameCount = 0;
let animationId;

function gameLoop(){
  animationId = requestAnimationFrame(gameLoop);
  frameCount++;

  // 1) 화면 지우기
  ctx.clearRect(0,0, canvas.width, canvas.height);

  // 2) 배경 스크롤
  bgOffset += bgSpeed;
  drawBackground(bgOffset);

  // 3) 땅 스크롤
  groundOffset += groundSpeed;
  drawGroundTiling(groundOffset);

  // 4) 장애물 생성 (2초마다 한 번)
  if(frameCount % 120 === 0){
    cactusList.push(new Cactus());
  }

  // 5) 장애물 이동 / 충돌 체크
  for(let i = cactusList.length - 1; i >= 0; i--){
    let c = cactusList[i];
    c.x -= groundSpeed;
    c.draw();

    // 충돌 시 게임오버
    if(isCollision(pika, c)){
      cancelAnimationFrame(animationId);
      alert("게임 오버!");
      return;
    }

    // 화면 밖으로 나가면 제거
    if(c.x + c.width < 0){
      cactusList.splice(i,1);
    }
  }

  // 점프 처리
  //    (아주 간단한 방식: 25프레임 위로, 그 후 내려오기)
  if(pika.isJumping){
    pika.y -= 4; 
    pika.jumpCount++;
    if(pika.jumpCount > 25){
      pika.isJumping = false;
      pika.jumpCount = 0;
    }
  } else {
    // 바닥(= y=160)까지 서서히 내려옴
    if(pika.y < 160){
      pika.y += 4;
    }
  }

  // 7) 캐릭터 그리기
  pika.draw();
}

// --------------------------------------------------
//  입력 (스페이스 => 점프)
// --------------------------------------------------
document.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){
    // 바닥에 있을 때만 점프
    if(!pika.isJumping && pika.y >= 130){
      pika.isJumping = true;
      pika.jumpCount = 0;
    }
  }
});

// --------------------------------------------------
// 게임 시작
// --------------------------------------------------
gameLoop();
