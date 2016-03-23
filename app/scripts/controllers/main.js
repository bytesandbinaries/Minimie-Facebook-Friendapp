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
    $scope.picture_url=[{url:'1.png'},{url:'2.png'},{url:'3.png'},{url:'4.png'}];
    $scope.mainurl=$scope.picture_url[0].url;
    $scope.imgpos=0;
    new Medium({
        element: document.getElementById('message'),
        mode: Medium.richMode
        //placeholder: 'Your Arti
    });
    $scope.select_pic=function(dir){
        console.log($scope.imgpos);
        (dir==0)?$scope.imgpos++:$scope.imgpos--;
        ($scope.imgpos<0)?$scope.imgpos=0:($scope.imgpos>($scope.picture_url.length-1))?$scope.imgpos=$scope.picture_url.length-1:$scope.imgpos=$scope.imgpos;
        console.log($scope.imgpos);
        $scope.mainurl=$scope.picture_url[$scope.imgpos].url;
    }
    $scope.message="Editable text, click to add or edit the content";

    $scope.draw=function(){
        //this draws all the element on the canvas;
        $scope.showcanvass=true;
        var c = document.getElementById("card");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);//clears the content of the canvas before drawing
        ctx.font = "30px Arial";
        var t=  document.getElementById('message').textContent;
        ctx.beginPath();
        ctx.rect(0, 0, 600, 450);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText('Minimie Friend\'s Card',40,50);//fills the canvas with the default minimie message.
        var maxWidth = 200;      var lineHeight = 25; //sets maximum width and line for the user message for warping the text-align
        ctx.font= "20px Calibri";
        ctx.fillStyle = '#f99';
        $scope.wrapText(ctx, t, 310, 100, maxWidth, lineHeight);//calls a function that wrap the text and draws it.
        //ctx.fillText(t,310,100);
        var i= document.getElementById('card_img');
        ctx.drawImage(i,40,80,250, 250);

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
        console.log('sjpgsdf');
        var c = document.getElementById("card");
        var img = c.toDataURL("image/jpeg");
        var form_data=parsetoformdata(img);
        $http.post('server/upload.php',  form_data, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}                })
         .then(function(response){

             var url='http://bytesandbinaries.com/app/images/'+response.data;
             console.log(url);
             //request accessToken
             FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
              }
            } );
             FB.api('/me/photos', 'post', {
                message:'Checking tags',
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
