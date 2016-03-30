'use strict';

/**
 * @ngdoc function
 * @name friendappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the friendappApp
 */
var main=angular.module('friendappApp');
main.controller('AppCtrl',['$scope','userData', '$location', '$rootScope', function($scope,userData, $location, $rootScope){
   $scope.user=userData.data();
   $scope.user.allfriends=[];
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
  FB.login(function(response) { }, {scope: 'public_profile,email,user_friends'});
 }
 $scope.$on('loadFriends', function(event, data) {
        $scope.FBgetfriends();
    })
 function getfriends(response){
     for( var friend in response.data){
       $scope.user.allfriends.push(response.data[friend]);
      // $('#friends ul').append('<li><a href="#">' + friends.name + '</a></li>');
    }
     console.log($scope.user.allfriends);
     if( response.paging.next){
         console.log('fetching next page...');
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
    $scope.showcanvass=false
    $scope.picture_url=[

            {url:'1.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p>Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'2.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p>Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'3.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p>Olakuunmi.</p>", w:319, h:319, r:1},
            {url:'4.png', message:"<p>The dark ones run when they see the sun.</p><p>But you and I, we only run for fun.</p><p>My BBF Forever:</p><p>Olakuunmi.</p>", w:319, h:319, r:1}]


    $scope.mainurl=$scope.picture_url[0].url;
    $scope.textwritup= $scope.picture_url[0].message;
    $scope.imgpos=0;
    $scope.imgheight=350;
    $scope.imgwidth=350;
    $scope.imgr=0.85;
    new Medium({
        element: document.getElementById('message'),
        mode: Medium.richMode
        //placeholder: 'Your Arti
    });
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

        //ctx.fillStyle = "black";
        //ctx.fillText('Minimie Friend\'s Card',40,50);//fills the canvas with the default minimie message.
        var maxWidth = 200;      var lineHeight = 25; //sets maximum width and line for the user message for warping the text-align

        ctx.font= "20px Delius Swash Caps";
        ctx.fillStyle = '#f7f7f7';
        $scope.wrapText(ctx, t, 310, 100, maxWidth, lineHeight);//calls a function that wrap the text and draws it.

        //ctx.fillText(t,310,100);
        var i= document.getElementById('card_img');
        console.log($scope.imgheight)
        var imgh= Math.floor($scope.imgheight*$scope.imgr); //calculate new image height
        var imgw= Math.floor($scope.imgwidth*$scope.imgr);  //calculates new image width
        console.log(imgh);
        ctx.drawImage(i,0,80,imgw, imgh);
    }
    $scope.wrapText=function(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
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
                    }else{
                      //tags friend
                      var postId = response.id;
                      FB.api(postId+'/tags?to='+$scope.user.friendId, 'post', function(response){
                         if (!response || response.error) {
                            console.log(response);
                         }
                      });
                    }
            });

          },
         function(err){  console.log('Images Couldn\'t be added.'+err); });
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
