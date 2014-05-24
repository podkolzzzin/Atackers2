/**
 * Created by JetBrains PhpStorm.
 * User: Admin
 * Date: 05.12.11
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */
var isPaused=true;
var isAlert=false;
var bullets=new Array();
var eMas=new Array();
var score=0;
function phCheckCollisionPointRect(Px, Py, Rx, Ry, Rw, Rh) { //P - point, R-rectangle
    if (Px > Rx &&
        Px < (Rx + Rw) &&
        Py > Ry &&
        Py < (Ry + Rh)) {
        return true;
    }
    else {
        return false;
    }
}
function phCheckCollisionRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
    //$(document).append('<div style="width:'+w1+'px;height:'+h1+'px;left:'+x1+'px;top:'+y1+'px;background-color:black;position:absolute">11111111</div>');
    //$(document).append('<div style="width:'+w2+'px;height:'+h2+'px;left:'+x2+'px;top:'+y2+'px;background-color:green;position:absolute">11111111111</div>');
    if (phCheckCollisionPointRect(x1, y1, x2, y2, w2, h2) == true ||                  //left top corner (1st rect) is in 2nd rect
        phCheckCollisionPointRect((x1 + w1), y1, x2, y2, w2, h2) == true ||           //right top
        phCheckCollisionPointRect(x1, (y1 + h1), x2, y2, w2, h2) == true ||           //left bottom
        phCheckCollisionPointRect((x1 + w1), (y1 + h1), x2, y2, w2, h2) == true)      //right bottom
    {
        return true;
    }
    else {
        return false;
    }
}


var _pause=0;
var _slow=48;
var _times=0;
var _vertical=0;
var _horizontal=0;
var game;
var bonuses;
var bonusMas=new Array();
var player;
var iter=0;
var scoreBox;
var bColors=new Array();
var globalTimer;
bColors.push('black');
bColors.push('silver');
bColors.push('red');
bColors.push('blue');
bColors.push('gold');

function random(min, max) {
    var res = Math.random() * (max - min) + min;
    res = Math.round(res);
    return res;
}
function chanse(chanse)
{
    return chanse>=random(1,100);
}
function Bullet()
{
    this.x;
    this.y;
    this.elem;
    this.height=20;
    this.width=20;
    this.create=function()
    {
        this.elem=document.createElement('div');
        this.elem.setAttribute('class','enemy');
        this.elem.style.position='absolute';
        this.elem.style.top=this.y+'px';
        this.elem.style.left=this.x+'px';
        game.appendChild(this.elem);
    }
}
function Bonus()
{
    this.x;
    this.y;
    this.elem;
    this.active; // function
    this.type; // name
    this.width;
    this.height;
    this.bgColor;
    this.create=function()
    {
        this.elem=document.createElement('div');
        this.elem.setAttribute('class','bonus');

        this.elem.style.backgroundColor=this.bgColor; ;
        this.elem.style.top=this.y+'px';
        this.elem.style.left=this.x+'px';
        this.elem.innerHTML=this.type;
        game.appendChild(this.elem);
    }
}
function pause()
{
    _pause+=80;
}
function slow()
{
    _slow=200;
    _times=600;
}
function vertical()
{
    _vertical+=3;
}
function horizontal()
{
    _horizontal+=3;
}
function randomBonus()
{
    var t=new Bonus();
    var trand=random(0,1000);
    if(trand>995)
    {
        t.type='P';
        t.bgColor='gray';
        t.active=pause;

    }
    else if(trand>994)
    {
        t.type='S';
        t.active=slow;
        t.bgColor='blue'
    }
    else if(trand>990)
    {
        t.type='|';
        t.bgColor='red';
        t.active=vertical;
    }
    else if(trand>988)
    {
        t.type='—';
        t.bgColor='green';
        t.active=horizontal;
    }
    else
    {
        return false;
    }
    return t;

}
function Enemy()
{
    this.x;
    this.y;
    this.hp=1;
    this.elem;
    this.width=20;
    this.height=20;
    this.bonus=randomBonus();
}
function Player()
{
    this.x=0;
    this.y=360;
    this.width=60;
    this.height=40;
    this.elem;
    this.bonuses=new Array();
    this.shut=function()
    {
        if(_horizontal==0)
        {
            if(score<200)
            {
                var t=new Bullet();
                t.x=this.x+20;
                t.y=this.y;
                t.create();
                bullets.push(t);
            }
            else
            {
                var t=new Bullet();
                t.x=this.x+40;
                t.y=this.y;
                t.create();
                bullets.push(t);
                t=new Bullet();
                t.x=this.x;
                t.y=this.y;
                t.create();
                bullets.push(t);
            }
        }
        else if(_horizontal>0)
        {
            _horizontal--;
            for(var i=0;i<20;i++)
            {
                var t=new Bullet();
                t.x=i*20;
                t.y=this.y;
                t.create();
                bullets.push(t);
            }
        }
    }
    this.create = function () {
        $('#game').append('<div style="position:relative;" id="player">' + '<div style="top:20px;" class="enemy"></div>' + '<div style="top:20px;"  class="enemy"></div>' + '<div style="top:20px;"  class="enemy"></div>' + '<div style="left:20px;top:-20px;"  class="enemy"></div>' + '</div>');
        this.elem=document.getElementById('player');

    }
    this.findBonus=function(type) {
        for(var i=0;i<this.bonuses.length;i++)
        { 
            if(this.bonuses[i].type==type)
            {
                return i;
            }
        }
        return false;
    }
}

function save()
{
    var inp=document.getElementById("inpName");
    game.innerHTML='<iframe style="border:0;width:100%;height:100%" src="http://lugbasket.org.ua/Atackers/atackers.php?score='+score+'&name='+inp.value+'"></input>';
}

function enemyGenerator()
{
    var t;
    for(var i=0;i<eMas.length;i++)
    {
        for(var j=0;j<eMas[i].length;j++)
        {
            eMas[i][j].y+=20;
            if(eMas[i][j].y>360)
            {
                if(globalTimer)
                {
                    clearInterval(globalTimer);
                    game.style.backgroundColor='black';
                    game.innerHTML='<input placeholder="Введите своё имя!" maxlength="20" style="background-color:silver;color:black;height:30px;width:100%;font-size:25pt;" id="inpName" /><button style="font-size:16pt;width:100%" onclick="save();">Сохранить</button>';

                }
                return;

            }
            eMas[i][j].elem.style.top=eMas[i][j].y+'px';
        }
    }
    for(var i=0;i<20;i++)
    {
        t=new Enemy();
        t.y=0;
        t.x=i*20;
        t.elem=document.createElement('div');
        t.elem.setAttribute('class','enemy');
        t.elem.style.position='absolute';
        if(score>0 && score<100)
        t.hp=1;
        else if(score>100 && score<200)
        {
            var trand=random(0,100);
            if(trand>90) t.hp=2;
            else if(trand>87) t.hp=3;
            else if(trand>86) t.hp=4;
            else t.hp=1;
        }
        else if(score>200 && score<300)
        {
            var trand=random(0,100);
            if(trand>90) t.hp=3;
            else if(trand>87) t.hp=4;
            else if(trand>86) t.hp=5;
            else if(trand>76) t.hp=2;
            else t.hp=1;
        }
        else if(score>300 && score<500)
        {
		    var trand=random(0,100);
             if(trand>90) t.hp=4;
            else if(trand>87) t.hp=5;
            else if(trand>76) t.hp=3;
            else if(trand>66) t.hp=2;
            else t.hp=1;
        }
		else if(score>500)
		{
			var trand=random(0,100);
			if(trand>80) t.hp=2
			else if(trand>65) t.hp=3;
			else if(trand>55) t.hp=4;
			else if(trand>50) t.hp=5;
			else t.hp=1;
		}
		else t.hp=1;
        t.elem.style.backgroundColor=bColors[t.hp-1];
        t.elem.style.top=t.y+'px';
        t.elem.style.left=t.x+'px';
        game.appendChild(t.elem);
        eMas[i].push(t);
    }
}
var canShut,canMove;

function useBonus()
{
    if(!isPaused)
    {
        var tmas=(bonuses.getElementsByTagName('div'));
        var ii=0;
        for(var i=0;i<tmas.length;i++)
        {
            if(this==tmas[i])
            {
                ii=i;
            }
        }
        if(_vertical>0 && player.bonuses[ii].type=='—') return;
        if(_horizontal>0 && player.bonuses[ii].type=='|') return;
        player.bonuses[ii].active();
        player.bonuses.splice(ii,1);
        updateBonusBlock()
    }
}
function useBonusById(index)
{

        if(_vertical>0 && player.bonuses[ii].type=='—') return;
        if(_horizontal>0 && player.bonuses[ii].type=='|') return;
        player.bonuses[index].active();
        player.bonuses.splice(index,1);
        updateBonusBlock()
}
function updateBonusBlock()
{
    bonuses.innerHTML='';
    for(var i=0;i<player.bonuses.length;i++)
    {
        var a=document.createElement('div');
        a.setAttribute('class','bonus');
        a.style.position='static';
        a.style.backgroundColor=player.bonuses[i].bgColor; 
        a.innerHTML=player.bonuses[i].type;
        a.onclick=useBonus;
        bonuses.appendChild(a);
    }
}
function globalTimerFunction()
{
    if(!isPaused)
    {
        if(!_pause)
        {
           if(iter%_slow==0)
            {
                enemyGenerator();
            }
        }
        else
        {
            _pause--;
        }
        if(_times>0) _times--;
        else
        {
            _slow=48;
        }
        if(iter%8==0)
        {
            for(var i=0;i<bonusMas.length;i++)
            {
                bonusMas[i].y+=20;
                if(phCheckCollisionRectRect(bonusMas[i].x,bonusMas[i].y,20,20,player.x,player.y,player.width,player.height))
                {
                     bonusMas[i].elem.parentNode.removeChild(bonusMas[i].elem);
                     player.bonuses.push(bonusMas[i]);
                     updateBonusBlock();
                     bonusMas.splice(i,1);
                     i--;
                     continue;
                }
                if(bonusMas[i].y>380)
                {
                    bonusMas[i].elem.parentNode.removeChild(bonusMas[i].elem);
                    bonusMas.splice(i,1);
                    i--;
                    continue;
                }
                else
                {
                    bonusMas[i].elem.style.top=bonusMas[i].y+'px';
                }

            }
        }
        var t;
        for(var i=0;i<bullets.length;i++)
        {

            bullets[i].y-=20;
            if(bullets[i].y<-400)
            {
                    bullets[i].elem.parentNode.removeChild(bullets[i].elem);
                    bullets.splice(i,1);
                    i--;
                    continue;
            }
            t=parseInt(bullets[i].x/20);
            if(t<0) break;
            if(eMas[t].length>0)
            {
                if(bullets[i].y<=eMas[t][0].y)
                {
                    eMas[t][0].hp--;
                    score++;
                    scoreBox.innerHTML='Score '+score;
                    if(eMas[t][0].hp<=0)
                    {
                        eMas[t][0].elem.parentNode.removeChild(eMas[t][0].elem);
                        if(eMas[t][0].bonus)
                        {
                            eMas[t][0].bonus.x=eMas[t][0].x;
                            eMas[t][0].bonus.y=eMas[t][0].y;
                            eMas[t][0].bonus.create();
                            bonusMas.push(eMas[t][0].bonus)
                        }
                        eMas[t].splice(0,1);

                    }
                    else
                    {
                        eMas[t][0].elem.style.backgroundColor=bColors[eMas[t][0].hp-1];
                    }
                    if(_vertical<=0 || bullets[i].y<=0)
                    {
                        bullets[i].elem.parentNode.removeChild(bullets[i].elem);
                        bullets.splice(i,1);
                        i--;
                         if(_vertical>=0) _vertical--;
                        continue;
                    }

                }
            }
            bullets[i].elem.style.top=bullets[i].y+'px';
        }
        if(iter%2==0)
        canMove=true;
        if(iter%3==0) canShut=true;
        iter++;
    }
}

function newGame()
{
    game = document.getElementById("game");

    game.innerHTML='';
    game.style.backgroundColor='white';
    bonuses = document.getElementById("bonuses");
    var tbut=document.getElementById('pBut');
    tbut.innerHTML='Старт';
    bonuses.innerHTML='';
    globalTimer = setInterval(globalTimerFunction, 50);
    player = new Player();
    scoreBox=document.getElementById('scoreBox');
    player.create();
    document.onkeydown = mover;
    isPaused=true;
    isAlert=false;
    bullets=new Array();
    eMas=new Array();
    score=0;
    iter=0;
    var _pause=0;
    _slow=48;
    _times=0;
    _vertical=0;
    _horizontal=0;
    bonusMas=new Array();
    iter=0;
    for(var i=0;i<20;i++)
    {
        eMas.push(new Array());
    }

}
function hideHelp(el)
{
    document.getElementsByTagName('body')[0].removeChild(el.parentNode.parentNode);
}
function help()
{
    isPaused=true;
    var helpBox=document.createElement('div');
    helpBox.setAttribute('class','helpBox');
    helpBox.innerHTML='<div id="helpText"><p style="color:silver;font-size:16pt;">Справка</p><ol>' +
            '                                                                     <li><b>Управление</b><ul>' +
            '                                                                        <li>-> Вправо</li>' +
                                                                                    '<li><- Влево</li>' +
            '<li>Enter Стрельба</li>    ' +
            '<li>Num1 Вертикальная атака</li>' +
            '<li>Num2 Горизонтальная атака</li>' +
            '<li>Num3 Замедлить врагов</li>' +
            '<li>Num4 Остановить врагов</li></ul></li>' +
            '<li><b>Бонусы</b><ul>' +
            '<li><div class="bonus" style="background-color:red;position:static;float:left;">|</div> &nbsp;Мощное оружие уничтожает всех врагов на одной вертикале</li>' +
            '<li><div class="bonus" style="background-color:green;position:static;float:left;">—</div> &nbsp;Мощное оружие уничтожает всех смельчаков которые лезут первыми</li>' +
            '<li><div class="bonus" style="background-color:blue;position:static;float:left;">S</div> &nbsp; Слегка замедляет врага... Может иметь побочные єффекты</li>' +
            '<li><div class="bonus" style="background-color:gray;position:static;float:left;">P</div> &nbsp; На короткое время деморализует противника и останавливает его наступление</li></ul></li>' +
                                                                                 '</ol><div onclick="hideHelp(this);" style="position:absolute;top:5px;left:94%;border:1px solid white;text-align:center;width:20px; height:20px;">X</div></div>';
    $('body').append(helpBox);
}

function mover(e) {
    if(!isPaused)
    {
        if (canMove) {
            if (e.keyCode == 39) {
                if(score<200)
                {
                    if (player.x < 360) {
                        player.x += 20;
                        player.elem.style.left = player.x + 'px';
                    }
                }
                else
                {
                    if (player.x < 340) {
                        player.x += 20;
                        player.elem.style.left = player.x + 'px';
                    }
                }
            }
            else if (e.keyCode == 37) {
                if(score<200)
                {
                    if (player.x > -10) {
                        player.x -= 20;
                        player.elem.style.left = player.x + 'px';
                    }
                }
                else
                {
                    if (player.x >= 20) {
                        player.x -= 20;
                        player.elem.style.left = player.x + 'px';
                    }
                }
            }
            canMove=false;

        }
        if(canShut)
        {
            if(e.keyCode == 13)
            {
                player.shut();
            }
            canShut=false;
        }

        if(e.keyCode==97)
        {
            useBonusById(player.findBonus('|'));
        }
        else if(e.keyCode==98)
        {
            useBonusById(player.findBonus('—'));
        }
        else if(e.keyCode==99)
        {
            useBonusById(player.findBonus('S'));
        }
        else if(e.keyCode==100)
        {
            useBonusById(player.findBonus('P'));
        }
    }
}