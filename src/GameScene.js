var isGameOver = false;
var self = null;
var soapScoreNum = 0;
var flashSprite = null;
var Game = cc.Layer.extend({
    isMouseDown: false,
    world: null,
    walls:null,
    screenSize: null,
    lazyLayer: null,
    groundSize: null,
    groundArray: null,
    soapArray:null,
    soapScoreSprite:null,
    soapScoreLabel:null,
    birdbody: null,
    tubeArray: null,
    birdSize: null,
    birdSprite:null,
    birdPicName:null,
    space:null,
    init: function () {
        this._super();
        self = this;
        screenSize = cc.Director.getInstance().getWinSize();
        this.setTouchEnabled(true);

        isGameOver = false;
        soapScoreNum = 0;

        lazyLayer = cc.Layer.create();
        this.addChild(lazyLayer);

        tubeArray = Array();
        soapArray = Array();
        groundArray = Array();
        birdSize = cc.Sprite.create(s_Bird1).getContentSize();

        var bgsprite = cc.Sprite.create(s_bg);
        bgsprite.setPosition(screenSize.width / 2, screenSize.height / 2);
        lazyLayer.addChild(bgsprite, 0);

        for (var i = 0; i < 2; i++)
        {
            var groundsprite = cc.Sprite.create(s_Ground);
            groundSize = groundsprite.getContentSize();
            groundsprite.setPosition(screenSize.width / 2 + screenSize.width * i, groundSize.height / 2);
            lazyLayer.addChild(groundsprite, 100);

            var ｍoveToA = cc.MoveTo.create(s_groundSpeed * (i + 1), cc.p(-screenSize.width / 2, groundsprite.getPositionY()));

            var Action = cc.Sequence.create
                (
                    ｍoveToA,
                    cc.CallFunc.create(this.groundCallback, groundsprite,this)
                );
            groundsprite.runAction(Action);
            groundArray.push(groundsprite);

        }


        space = new cp.Space();


        birdPicName = s_Bird1;
        birdSprite =  this.createPhysicsSprite( cc.p(screenSize.width / 2-45, screenSize.height / 2-24) ,this);
        this.addChild( birdSprite );


        var startItem = cc.MenuItemImage.create
        (
            s_tutorial,
            s_tutorial,
            function ()
            {
                this.startGame();
                startItem.removeFromParent(true);
            },
            this
        );

        var menu = cc.Menu.create(startItem);
        menu.setPosition(0,0);
        this.addChild(menu, 1);
        startItem.setPosition(screenSize.width / 2, screenSize.height / 2);

        var soapScoreSprite = cc.Sprite.create(s_soap);
        soapScoreSprite.setPosition(screenSize.width / 10, screenSize.height / 1.1);
        lazyLayer.addChild(soapScoreSprite, 5);


        soapScoreLabel = cc.LabelTTF.create(soapScoreNum.toString(), "Arial", 30);
        soapScoreLabel.setPosition(screenSize.width / 6, screenSize.height / 1.1);
        lazyLayer.addChild(soapScoreLabel, 5);

        return true;
    },
    startGame:function()
    {
        this.initPhysics();
        this.scheduleUpdate();
        this.schedule(this.createTube, s_createTubeTime);

        this.schedule(this.changeSpriteFrame, s_sparkSpeed);
    },
    groundCallback: function (groundsprite,self)
    {
        groundsprite.setPosition(screenSize.width/2+screenSize.width-10, groundSize.height/2);

        var ｍoveToA = cc.MoveTo.create(s_groundSpeed*2,cc.p(-screenSize.width/2,groundsprite.getPositionY()));

        var Action = cc.Sequence.create(
            ｍoveToA,
            cc.CallFunc.create(self.groundCallback, groundsprite,self)
        );
        groundsprite.runAction(Action);
    },
    changeSpriteFrame:function()
    {
        if(birdPicName == s_Bird1)
        {
            birdPicName = s_Bird2;
        }
        else
        {
            birdPicName = s_Bird1;
        }

        var aSprite = cc.Sprite.create(birdPicName);
        birdSprite.setTexture(aSprite.getTexture());
    },
    createTube:function (dt)
    {
        var topSprite = cc.Sprite.create(s_PipeTop);
        topSprite.setAnchorPoint(1.0,1.0);
        lazyLayer.addChild(topSprite, 0);


        var bottomSprite = cc.Sprite.create(s_PipeBottom);
        bottomSprite.setAnchorPoint(1.0,0.0);
        lazyLayer.addChild(bottomSprite, 0);


        var soapSprite = cc.Sprite.create(s_soap);
        this.addChild(soapSprite,100);

        var aNum = Math.floor(Math.random()*3);

        switch(aNum)
        {
            case 0:
                topSprite.setPosition(screenSize.width, screenSize.height+screenSize.height/2);
                bottomSprite.setPosition(screenSize.width, -screenSize.height/1.5);

                soapSprite.setPosition(screenSize.width-20, screenSize.height/2);

                break;
            case 1:
                topSprite.setPosition(screenSize.width, screenSize.height+screenSize.height/1.8);
                bottomSprite.setPosition(screenSize.width, -screenSize.height/1.8);

                soapSprite.setPosition(screenSize.width-20, screenSize.height/1.8);

                break;
            case 2:
                topSprite.setPosition(screenSize.width, screenSize.height+screenSize.height/1.2);
                bottomSprite.setPosition(screenSize.width, -screenSize.height/3);
                soapSprite.setPosition(screenSize.width-20, screenSize.height/1.2);

                break;
            default:

                break;
        }



        var topMoveToA = cc.MoveTo.create(s_tubeSpeed,cc.p(0,topSprite.getPositionY()));

        var topAction = cc.Sequence.create(
            topMoveToA,
            cc.CallFunc.create(this.topCallback, topSprite)
        );
        topSprite.runAction(topAction);
        tubeArray.push(topSprite);

        var bottomMoveToA = cc.MoveTo.create(s_tubeSpeed,cc.p(0,bottomSprite.getPositionY()));
        var bottomAction = cc.Sequence.create(
            bottomMoveToA,
            cc.CallFunc.create(this.bottomCallback, bottomSprite)
        );

        bottomSprite.runAction(bottomAction);
        tubeArray.push(bottomSprite);


        var soapMoveToA = cc.MoveTo.create(s_tubeSpeed,cc.p(0,soapSprite.getPositionY()));
        var soapAction = cc.Sequence.create(
            soapMoveToA,
            cc.CallFunc.create(this.soapCallback, soapSprite)
        );

        soapSprite.runAction(soapAction);
        soapArray.push(soapSprite);

    },

    initPhysics:function()
    {
        var staticBody = space.staticBody;

        // Walls
        walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(screenSize.width,25), 0 ),				// bottom
            new cp.SegmentShape( staticBody, cp.v(0,screenSize.height+80), cp.v(screenSize.width,screenSize.height+50), 0),	// top
            new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,screenSize.height), 0),				// left
            new cp.SegmentShape( staticBody, cp.v(screenSize.width,0), cp.v(screenSize.width,screenSize.height), 0)	// right
        ];
        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            if(0 == i)
            {
                shape.setElasticity(0.0);
            }
            else
            {
                shape.setElasticity(0.0);
            }

            shape.setFriction(1);

            space.addStaticShape( shape );
        }

        // Gravity
        space.gravity = cp.v(0, -700);
    },
    createPhysicsSprite:function( pos ,self)
    {
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos( pos );
        birdbody = body;
        space.addBody( body );
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.0 );
        shape.setFriction( 0.5 );
        space.addShape( shape );

        var sprite = cc.PhysicsSprite.create(s_Bird1);
        sprite.setBody( body );

        return sprite;
    },
   update:function( delta ,self)
    {
        space.step( delta );

        if(isGameOver)
        return;

        var reduceRect = 5;
         birdBox = cc.rect(birdSprite.getPosition().x-birdSize.width/2+reduceRect,birdSprite.getPosition().y-birdSize.height/2+reduceRect,birdSize.width-reduceRect,birdSize.height-reduceRect);
        for(var i =0;i<tubeArray.length;i++)
        {
            var element = tubeArray[i];
            if(cc.rectIntersectsRect(birdBox,element.getBoundingBox()))
            {

                GameOver();
            }
        }
        for(var i =0;i<soapArray.length;i++)
        {
            var element = soapArray[i];
                           
            if(cc.rectIntersectsRect(birdBox,element.getBoundingBox()))
            {
                /*
                var ｍoveToA = cc.MoveTo.create(1.0, cc.p(screenSize.width / 10-element.getBoundingBox().x, screenSize.height / 1.1-element.getBoundingBox().y));
                           
                var Action = cc.Sequence.create
                (
                    ｍoveToA,
                    cc.CallFunc.create(this.getSoapCallback, element)
                );
                element.runAction(Action);
                  */
                cc.AudioEngine.getInstance().playEffect("res/sfx_point.mp3");
                soapArray.shift();
                this.getSoapCallback(element);
                soapScoreNum++;
                soapScoreLabel.setString(soapScoreNum.toString());
                
            }
        }

        if(birdSprite.getPosition().y-birdSize.height/2<groundSize.height)
        {
            GameOver();
        }

    },
    topCallback:function(topSprite)
    {
        topSprite.removeFromParent(true);
        tubeArray.shift();
    },
    bottomCallback:function(bottomSprite)
    {
        bottomSprite.removeFromParent(true);
        tubeArray.shift();
    },
    soapCallback:function(soapSprite)
    {
        soapSprite.removeFromParent(true);
        soapArray.shift();
    },
    getSoapCallback:function(element)
    {
       element.removeFromParent(true);
    },
    onTouchesBegan:function (touches, event) {
        this.isMouseDown = true;
        if(isGameOver)
        return;
        cc.AudioEngine.getInstance().playEffect("res/sfx_wing.mp3")
        birdbody.applyImpulse(cp.v(0,400), cp.v(0,0));
    },
    onTouchesMoved:function (touches, event) {
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(touches[0].getLocation().x, touches[0].getLocation().y);
            }
        }
    },
    onTouchesEnded:function (touches, event) {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    }

});

var GameOver = function()
{
    //this.unscheduleAllCallbacks();

    /*
     cc.Director.getInstance().pause();//暂停场景
     cc.Director.getInstance().resume();
     */
    isGameOver =true;
    //cc.ActionManager.getInstance().pauseAllRunningActions();

    cc.AudioEngine.getInstance().playEffect("res/sfx_hit.mp3");

    flashSprite = cc.Sprite.create(s_flash);
    flashSprite.setPosition(screenSize.width / 2, screenSize.height / 2);
    self.addChild(flashSprite, 1000);
    self.schedule(flash,0.1,1,0);


    self.unschedule(self.createTube);
    self.unschedule(self.changeSpriteFrame);

    for(var i =0;i<tubeArray.length;i++)
    {
        tubeArray[i].stopAllActions();
    }
    for(var i =0;i<groundArray.length;i++)
    {
        groundArray[i].stopAllActions();
    }
    for(var i =0;i<soapArray.length;i++)
    {
        soapArray[i].stopAllActions();
    }
    //var shape = walls[0];
    //shape.setElasticity(2.0);





    var bestScore = sys.localStorage.getItem('bestScore');
    var secondScore = sys.localStorage.getItem('secondScore');
    var medalSprite;
    if(soapScoreNum>bestScore-1)
    {
        sys.localStorage.setItem('bestScore',soapScoreNum);

        medalSprite = cc.Sprite.create("res/goldMedal.png");
    }
    else if(soapScoreNum>secondScore-1 && soapScoreNum<bestScore)
    {
        sys.localStorage.setItem('secondScore',soapScoreNum);

        medalSprite = cc.Sprite.create("res/silverMedal.png");
    }
    else
    {
        medalSprite = cc.Sprite.create("res/bronzeMedal.png");
    }
    medalSprite.setPosition(screenSize.width / 3, screenSize.height / 2.4);
    self.addChild(medalSprite,10000);


    var boardSprite = cc.Sprite.create(s_scoreBoard);
    boardSprite.setPosition(screenSize.width / 2, screenSize.height / 2);
    self.addChild(boardSprite, 5);

    var gameOverSprite = cc.Sprite.create(s_gameOver);
    gameOverSprite.setPosition(screenSize.width / 2, screenSize.height / 1.2);
    self.addChild(gameOverSprite, 5);

    var newScoreLabel = cc.LabelTTF.create(soapScoreNum.toString(), "Arial", 30);
    newScoreLabel.setPosition(screenSize.width / 1.4, screenSize.height / 1.8);
    self.addChild(newScoreLabel, 5);

    var bestScore = sys.localStorage.getItem('bestScore');
    var bestScoreLabel = cc.LabelTTF.create(bestScore.toString(), "Arial", 30);
    bestScoreLabel.setPosition(screenSize.width / 1.4, screenSize.height / 2.8);
    self.addChild(bestScoreLabel, 5);

    var replayItem = cc.MenuItemImage.create
    (
        s_replayBtn1,
        s_replayBtn2,
        function ()
        {
             var nextScene = cc.Scene.create();
             var nextLayer = new GameScene;
             nextScene.addChild(nextLayer);
             cc.Director.getInstance().replaceScene(cc.TransitionSlideInT.create(0.0, nextScene));
        },
        this
    );
    //replayItem.setPosition(boardSprite.getBoundingBox().x , boardSprite.getBoundingBox().y - replayItem.getBoundingBox.height);
    replayItem.setPosition(boardSprite.getBoundingBox().x+replayItem.getBoundingBox().width/2+20  , boardSprite.getBoundingBox().y-30);
    var rankingItem = cc.MenuItemImage.create
    (
        s_ranking,
        s_ranking,
        function ()
        {

        },
        this
    );
    //rankingItem.setPosition(boardSprite.getBoundingBox().x+boardSprite.getBoundingBox().width/2 , boardSprite.getBoundingBox().y - replayItem.getBoundingBox.height);
    rankingItem.setPosition(boardSprite.getBoundingBox().x+rankingItem.getBoundingBox().width*2-20 , boardSprite.getBoundingBox().y-30);

    var menu = cc.Menu.create(replayItem,rankingItem);
    menu.setPosition(0,0);
    self.addChild(menu, 1000);
}

var flash = function(dt)
{
    flashSprite.removeFromParent(true);
}
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Game();
        layer.init();
        this.addChild(layer);
    }
});



