'use strict';

/**
 * @ngdoc function
 * @name friendappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the friendappApp
 */
var main=angular.module('friendappApp');
main.controller('AppCtrl',['$scope','userData', '$location', '$rootScope', 'AuthService', function($scope,userData, $location, $rootScope, AuthService){
   $scope.user=userData.data();
   $scope.user.allfriends=[];
   $scope.deniedpermission=[];
   $scope.showpermission=false;
   $scope.logout = function() {
   FB.logout(function(response) {
      $scope.user.status="";
      $scope.user.name="Resume Game"
      $scope.user.totalscore=0;
      $scope.user.line1=0;
      $scope.user.line2=0;
      $scope.user.line3=0;
      $scope.user.facebook="";
      $scope.user.email=0;
      $scope.user.totalscore=0;
      $scope.user.currentleve=1;
      $scope.user.lastlevelscore=0;
      $location.path('/');
      $scope.$apply();
   });
 }
 $scope.FBlogin = function() {
  FB.login(function(response) { }, {scope: 'public_profile,email,user_friends, publish_actions'});
 }
 $scope.relogin= function(){
    $scope.user.permissions=[];
    $scope.showpermission=false;
    FB.login(function(response) {AuthService.watchLoginChange();}, { scope: 'public_profile,email,user_friends, publish_actions', return_scopes: true, auth_type: 'rerequest'
 });
}

 $scope.$on('loadFriends', function(event, data) {
        console.log($scope.user.permissions);
        for(var d=0; d<$scope.user.permissions.length; d++){
            console.log($scope.user.permissions[d]);
            if($scope.user.permissions[d].status=='declined'){
                var denied=$scope.user.permissions[d].permission;
                $scope.deniedpermission.push(denied);
                $scope.showpermission=true;
                console.log(denied)
            }
        }
        $scope.FBgetfriends();
    })
 function getfriends(response){
     for( var friend in response.data){
       $scope.user.allfriends.push(response.data[friend]);
      // $('#friends ul').append('<li><a href="#">' + friends.name + '</a></li>');
    }
     if( response.paging.next){
         $.getJSON(response.paging.next, function(response){
             getfriends(response);
         });

     }
     else{
        $rootScope.$broadcast('allfriendsloaded');
     }
 }
 $scope.FBgetfriends = function() {
    FB.api(
      "/"+$scope.user.id+"/taggable_friends",
      function(response) {
          if (response && !response.error) {
            getfriends(response);
          }
      })
 }
 }])
main.controller('MainCtrl', ['$scope','$http','userData', function ($scope, $http, userData) {

    $scope.user=userData.data();
    $scope.appflow="select_picture";
    $scope.showcanvass=false;
    $scope.picture_url=[

            {url:'1.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p> Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'2.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p> Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'3.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p> Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'4.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p> Olakuunmi.</p>", w:319, h:319, r:1}]


    $scope.mainurl=$scope.picture_url[0].url;
    $scope.textwritup= $scope.picture_url[0].message;
    $scope.imgpos=0;
    $scope.imgheight=350;
    $scope.imgwidth=350;
    $scope.imgr=0.85;
    $scope.message=false;
    $scope.note_message='processing';
    $scope.select_pic=function(dir){
    //    console.log($scope.imgpos);
        (dir==0)?$scope.imgpos++:$scope.imgpos--;
        ($scope.imgpos<0)?$scope.imgpos=0:($scope.imgpos>($scope.picture_url.length-1))?$scope.imgpos=$scope.picture_url.length-1:$scope.imgpos=$scope.imgpos;
        $scope.mainurl=$scope.picture_url[$scope.imgpos].url;
        $scope.imgheight=$scope.picture_url[$scope.imgpos].h;// image height
        $scope.imgwidth=$scope.picture_url[$scope.imgpos].w;// image width
        $scope.imgr=$scope.picture_url[$scope.imgpos].r; // the image reduction on canvas
        $scope.textwritup= $scope.picture_url[$scope.imgpos].message;
    }
    $scope.changeview=function(toview){
        $scope.appflow=toview;
        console.log(toview);
        if(toview=='edit-message-tagfriend'){
            new Medium({
                element: document.getElementById('message'),
                mode: Medium.richMode
                //placeholder: 'Your Arti
            });
        }
    }
    $scope.draw=function(){
        //this draws all the element on the canvas;
        $scope.showcanvass=true;
        var c = document.getElementById("card");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);//clears the content of the canvas before drawing
        ctx.font = "30px Delius Swash Caps";
        var t=  document.getElementById('message').textContent;
        ctx.beginPath();
        ctx.rect(0, 0, 600, 400);
        ctx.fillStyle = "#e74908";
        ctx.fill();
        var imgpatter=document.getElementById('imgbg');
        var pat=ctx.createPattern(imgpatter,"repeat");
        ctx.rect(0,0,600,400);
        ctx.fillStyle=pat;
        ctx.fill();
        var imglogo=document.getElementById("minimie_logo");
        ctx.drawImage(imglogo,320,40, 118,56);
        var maxWidth = 200;
        var lineHeight = 25; //sets maximum width and line for the user message for warping the text-align

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://fonts.googleapis.com/css?family=Delius+Swash+Caps';
        document.getElementsByTagName('head')[0].appendChild(link);

        // Trick from http://stackoverflow.com/questions/2635814/
        var image = new Image;
        image.src = link.href;
        image.onerror = function() {
            ctx.font = '20px "Delius Swash Caps"';
            ctx.fillStyle = '#f7f7f7';
            $scope.wrapText(ctx, t, 310, 130, maxWidth, lineHeight);//calls a function that wrap the text and draws it.
        };
        //ctx.font= "20px 'Delius Swash Caps'";


        //ctx.fillText(t,310,100);
        var i= document.getElementById('card_img');
        console.log($scope.imgheight)
        var imgh= Math.floor($scope.imgheight*$scope.imgr); //calculate new image height
        var imgw= Math.floor($scope.imgwidth*$scope.imgr);  //calculates new image width
        console.log(imgh);
        ctx.drawImage(i,0,80,imgw, imgh);
        $scope.appflow="card_view";
    }
    $scope.wrapText=function(context, text, x, y, maxWidth, lineHeight) {
        text=text.replace(/\./g, ". ")
        var words = text.split(' ');
        var line = '';
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if(words[n].indexOf('.')>0 || words[n].indexOf(':')>0 ){
            line=line+words[n];
            context.fillText(line, x, y);
            y += lineHeight*2;
            line='';
            continue;

            //console.log(words[n])
        }
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;

          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
    }
    $scope.saveandupload=function(){
        $scope.message=true;
        var t=  document.getElementById('message').textContent;
        var c = document.getElementById("card");
        var img = c.toDataURL("image/jpeg");
        var form_data=parsetoformdata(img);
        $http.post('server/upload.php',  form_data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}                })
         .then(function(response){

             var url='http://bytesandbinaries.com/minimiefb/images/'+response.data;
             console.log(url);
             //request accessToken
             FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
              }
            } );
             FB.api('/me/photos', 'post', {
                message:t,
                url:url
                }, function(response){
                    if (!response || response.error) {
                       console.log(response);
                       $scope.note_message='error'
                    }else{
                      //tags friend
                      var postId = response.id;
                      if($scope.user.friendId !=''){
                      FB.api(postId+'/tags?to='+$scope.user.friendId, 'post', function(response){
                             if (!response || response.error) {
                                //$scope.note_message='error';
                             }
                             else{
                                console.log('no error')
                                $scope.note_message='success';
                                $scope.$apply();
                             }
                          });
                      }
                      $scope.note_message='success';
                      $scope.$apply();
                    }
            });

          },
         function(err){  $scope.note_message='error'});
    }
    var parsetoformdata= function(data){
        var form_data = new FormData();
        if(typeof(data)==='object'){
            for ( var key in data ) {
                form_data.append(key, data[key]);
            }
        }
        else if(data!=''){
            form_data.append('data', data);
        }
        else{form_data.append('data', '');}
        return form_data;
    }
}]);
